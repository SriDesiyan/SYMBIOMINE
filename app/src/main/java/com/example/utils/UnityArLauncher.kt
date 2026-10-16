package com.example.utils

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.widget.Toast
import androidx.core.content.FileProvider
import com.example.data.FaceAuthRepository
import java.io.File

object UnityArLauncher {

  // Unity AR package mappings for each training module
  // Note: Both fire_module and gas3 APKs share com.sybioar.symbiofire package name
  const val FIRE_AR_PACKAGE = "com.sybioar.symbiofire"
  const val GAS_AR_PACKAGE = "com.sybioar.symbiofire"
  const val CONFINED_AR_PACKAGE = "com.sybioar.symbioconfined"
  const val PPE_AR_PACKAGE = "com.sybioar.symbioppe"

  private const val PREFS_NAME = "unity_module_prefs"
  private const val PREF_INSTALLED_MODULE = "installed_module_id"

  // Asset paths inside assets/modules/
  private const val ASSET_GAS = "modules/gas3.apk"
  private const val FILE_GAS = "gas3_installer.apk"

  private const val ASSET_FIRE = "modules/fire_module.apk"
  private const val FILE_FIRE = "fire_module_installer.apk"

  // Known fallback APK paths in local storage
  val FALLBACK_GAS_PATHS = listOf(
    "modules/gas3.apk",
    "gas3.apk",
    "Download/gas3.apk",
    "Downloads/gas3.apk",
    "SYMBIOMINE AR/UNITYSYMBIOMINEAR/gas3.apk",
    "gas_module.apk",
    "Download/gas_module.apk",
    "Downloads/gas_module.apk"
  )

  val FALLBACK_FIRE_PATHS = listOf(
    "SYMBIOMINE AR/UNITYSYMBIOMINEAR/fire1.apk",
    "SYMBIOMINE AR/UNITYSYMBIOMINEAR/try16.apk",
    "fire1.apk",
    "Download/fire1.apk",
    "Downloads/SYMBIOMINE AR/UNITYSYMBIOMINEAR/fire1.apk",
    "modules/fire_module.apk",
    "fire_module.apk"
  )

  fun getPackageForModule(moduleId: String): String {
    return when (moduleId) {
      "fire_extinguisher" -> FIRE_AR_PACKAGE
      "gas_leakage" -> GAS_AR_PACKAGE
      "confined_space" -> CONFINED_AR_PACKAGE
      "ppe_emergency" -> PPE_AR_PACKAGE
      else -> FIRE_AR_PACKAGE
    }
  }

  fun getModuleName(moduleId: String): String {
    return when (moduleId) {
      "fire_extinguisher" -> "Fire Safety & Extinguisher AR"
      "gas_leakage" -> "Gas Leak & Lockout Tagout AR"
      "confined_space" -> "Confined Space & Machinery AR"
      "ppe_emergency" -> "PPE & Emergency Response AR"
      else -> "Mining Safety AR"
    }
  }

  fun isUnityModuleInstalled(context: Context, moduleId: String): Boolean {
    val packageName = getPackageForModule(moduleId)
    val isPresent = try {
      context.packageManager.getPackageInfo(packageName, 0)
      true
    } catch (_: Exception) {
      false
    }
    if (!isPresent) return false

    if (moduleId == "gas_leakage" || moduleId == "fire_extinguisher") {
      val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
      val recorded = prefs.getString(PREF_INSTALLED_MODULE, null)
      if (recorded != null) {
        return recorded == moduleId
      }
    }
    return true
  }

  /**
   * Extracts bundled APK from app assets to private storage if not already extracted.
   */
  private fun extractApkFromAssets(context: Context, assetPath: String, fileName: String): File? {
    return try {
      val outFile = File(context.filesDir, fileName)
      if (!outFile.exists() || outFile.length() < 1_000_000L) {
        context.assets.open(assetPath).use { input ->
          outFile.outputStream().use { output ->
            input.copyTo(output, bufferSize = 1024 * 1024)
          }
        }
      }
      if (outFile.exists() && outFile.length() > 0) outFile else null
    } catch (e: Exception) {
      e.printStackTrace()
      null
    }
  }

  /**
   * Searches for fallback APK file in local storage roots.
   */
  private fun findLocalApkFile(context: Context, paths: List<String>): File? {
    val searchRoots = listOfNotNull(
      Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS),
      context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS),
      context.filesDir
    )

    for (root in searchRoots) {
      for (relPath in paths) {
        val file = File(root, relPath)
        if (file.exists() && file.isFile) {
          return file
        }
      }
    }
    return null
  }

  /**
   * Launches Android package installer for the given APK file.
   */
  fun installApk(context: Context, apkFile: File): Boolean {
    return try {
      val intent = Intent(Intent.ACTION_VIEW).apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
      }

      val apkUri: Uri = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
        FileProvider.getUriForFile(
          context,
          "${context.packageName}.fileprovider",
          apkFile
        )
      } else {
        @Suppress("DEPRECATION")
        Uri.fromFile(apkFile)
      }

      intent.setDataAndType(apkUri, "application/vnd.android.package-archive")
      context.startActivity(intent)
      true
    } catch (e: Exception) {
      e.printStackTrace()
      false
    }
  }

  /**
   * Launches the Unity AR APK for the specified module.
   * For Module 02 (Gas Leak & Lockout Tagout), specifically ensures gas3.apk is installed and launched.
   */
  fun launchUnityAr(
    context: Context,
    moduleId: String,
    onStatusMessage: (String) -> Unit = {}
  ): Boolean {
    val moduleName = getModuleName(moduleId)
    val worker = FaceAuthRepository.workerProfile.value
    val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    // ─── Module 02: Gas Leak & Lockout Tagout (gas3.apk) ─────────────────────
    if (moduleId == "gas_leakage") {
      val isPackagePresent = try {
        context.packageManager.getPackageInfo(GAS_AR_PACKAGE, 0) != null
      } catch (_: Exception) {
        false
      }
      val currentInstalledModule = prefs.getString(PREF_INSTALLED_MODULE, null)

      // If gas3.apk is already installed as the active module (or package exists and was marked)
      if (isPackagePresent && currentInstalledModule == "gas_leakage") {
        val launchIntent = context.packageManager.getLaunchIntentForPackage(GAS_AR_PACKAGE)
        if (launchIntent != null) {
          try {
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            launchIntent.putExtra("MODULE_ID", "gas_leakage")
            launchIntent.putExtra("module", "GAS_LOTO")
            launchIntent.putExtra("moduleId", "M02")
            launchIntent.putExtra("scene", "GASLEACKAGE")
            launchIntent.putExtra("SCENE_NAME", "GASLEACKAGE")
            launchIntent.putExtra("MODULE_NAME", moduleName)
            launchIntent.putExtra("WORKER_NAME", worker.name)
            launchIntent.putExtra("WORKER_ID", worker.workerId)
            launchIntent.putExtra("LAUNCH_SOURCE", "SYMBIOMINE_APP")

            context.startActivity(launchIntent)
            onStatusMessage("Launching Gas Leak & Lockout Tagout AR (gas3.apk)...")
            return true
          } catch (e: Exception) {
            onStatusMessage("Error launching $moduleName: ${e.localizedMessage}")
            return false
          }
        }
      }

      // If not installed, or fire module is currently installed, trigger gas3.apk install
      onStatusMessage("Preparing Gas Leak & Lockout Tagout AR (gas3.apk)...")
      val apkFile = extractApkFromAssets(context, ASSET_GAS, FILE_GAS)
        ?: findLocalApkFile(context, FALLBACK_GAS_PATHS)

      if (apkFile != null && apkFile.exists()) {
        val success = installApk(context, apkFile)
        if (success) {
          prefs.edit().putString(PREF_INSTALLED_MODULE, "gas_leakage").apply()
          onStatusMessage("Opening installer for Gas Leak AR (gas3.apk)...")
          return true
        }
      }

      onStatusMessage("Could not find gas3.apk in assets or storage.")
      Toast.makeText(context, "gas3.apk not found. Please verify assets/modules/gas3.apk.", Toast.LENGTH_LONG).show()
      return false
    }

    // ─── Module 01: Fire Safety & Extinguisher ──────────────────────────────
    if (moduleId == "fire_extinguisher") {
      val isPackagePresent = try {
        context.packageManager.getPackageInfo(FIRE_AR_PACKAGE, 0) != null
      } catch (_: Exception) {
        false
      }
      val currentInstalledModule = prefs.getString(PREF_INSTALLED_MODULE, null)

      if (isPackagePresent && currentInstalledModule == "fire_extinguisher") {
        val launchIntent = context.packageManager.getLaunchIntentForPackage(FIRE_AR_PACKAGE)
        if (launchIntent != null) {
          try {
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            launchIntent.putExtra("MODULE_ID", "fire_extinguisher")
            launchIntent.putExtra("module", "FIRE_SAFETY")
            launchIntent.putExtra("moduleId", "M01")
            launchIntent.putExtra("MODULE_NAME", moduleName)
            launchIntent.putExtra("WORKER_NAME", worker.name)
            launchIntent.putExtra("WORKER_ID", worker.workerId)
            launchIntent.putExtra("LAUNCH_SOURCE", "SYMBIOMINE_APP")

            context.startActivity(launchIntent)
            onStatusMessage("Launching Fire Safety AR...")
            return true
          } catch (e: Exception) {
            onStatusMessage("Error launching $moduleName: ${e.localizedMessage}")
            return false
          }
        }
      }

      // Fire module install if missing or switching from gas module
      val apkFile = extractApkFromAssets(context, ASSET_FIRE, FILE_FIRE)
        ?: findLocalApkFile(context, FALLBACK_FIRE_PATHS)

      if (apkFile != null && apkFile.exists()) {
        val success = installApk(context, apkFile)
        if (success) {
          prefs.edit().putString(PREF_INSTALLED_MODULE, "fire_extinguisher").apply()
          onStatusMessage("Opening installer for Fire Safety AR...")
          return true
        }
      }

      onStatusMessage("Could not find Fire Safety AR APK.")
      Toast.makeText(context, "Fire Safety AR APK not found.", Toast.LENGTH_LONG).show()
      return false
    }

    // ─── Other Modules (Confined Space, PPE, etc.) ───────────────────────────
    val packageName = getPackageForModule(moduleId)
    val launchIntent = context.packageManager.getLaunchIntentForPackage(packageName)

    if (launchIntent != null) {
      try {
        launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        launchIntent.putExtra("MODULE_ID", moduleId)
        launchIntent.putExtra("MODULE_NAME", moduleName)
        launchIntent.putExtra("WORKER_NAME", worker.name)
        launchIntent.putExtra("WORKER_ID", worker.workerId)
        launchIntent.putExtra("LAUNCH_SOURCE", "SYMBIOMINE_APP")

        context.startActivity(launchIntent)
        onStatusMessage("Launching $moduleName...")
        return true
      } catch (e: Exception) {
        onStatusMessage("Error launching $moduleName: ${e.localizedMessage}")
        return false
      }
    } else {
      onStatusMessage("Unity AR APK ($packageName) is not installed.")
      Toast.makeText(
        context,
        "Unity AR: '$packageName' not installed. Please install $moduleName.",
        Toast.LENGTH_LONG
      ).show()
      return false
    }
  }
}
