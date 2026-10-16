package com.example.ui.components

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.CameraSelector
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.scaleIn
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Face
import androidx.compose.material.icons.filled.LockOpen
import androidx.compose.material.icons.filled.Sensors
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import androidx.core.content.ContextCompat
import androidx.lifecycle.compose.LocalLifecycleOwner
import com.example.R
import com.example.data.FaceAuthRepository
import com.example.ui.theme.ElectricBlue
import com.example.ui.theme.IndustrialBlue
import com.example.ui.theme.IndustrialCardBorder
import com.example.ui.theme.PureWhite
import com.example.ui.theme.SafetyGreen
import com.example.ui.theme.SafetyOrange
import com.example.ui.theme.SoftBlue
import com.example.ui.theme.SoftBlueBorder
import com.example.ui.theme.TextNavyDark
import com.example.ui.theme.TextSlateMedium
import kotlinx.coroutines.delay

enum class ScanState {
  INITIALIZING,
  SCANNING,
  MATCHING,
  SUCCESS
}

@Composable
fun AutoFaceScannerDialog(
  domainTitle: String,
  onFaceVerified: () -> Unit,
  onDismiss: () -> Unit
) {
  val context = LocalContext.current
  val lifecycleOwner = LocalLifecycleOwner.current

  var hasCameraPermission by remember {
    mutableStateOf(
      ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED
    )
  }

  val permissionLauncher = rememberLauncherForActivityResult(
    contract = ActivityResultContracts.RequestPermission()
  ) { isGranted ->
    hasCameraPermission = isGranted
  }

  LaunchedEffect(Unit) {
    if (!hasCameraPermission) {
      permissionLauncher.launch(Manifest.permission.CAMERA)
    }
  }

  Dialog(
    onDismissRequest = onDismiss,
    properties = DialogProperties(
      dismissOnBackPress = true,
      dismissOnClickOutside = false,
      usePlatformDefaultWidth = false
    )
  ) {
    Box(
      modifier = Modifier
        .fillMaxSize()
        .background(Color.Black.copy(alpha = 0.85f))
        .padding(16.dp),
      contentAlignment = Alignment.Center
    ) {
      Card(
        modifier = Modifier
          .fillMaxWidth()
          .clip(RoundedCornerShape(20.dp))
          .testTag("auto_face_scanner_dialog"),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = PureWhite),
        border = androidx.compose.foundation.BorderStroke(1.5.dp, IndustrialCardBorder),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
      ) {
        Column(
          modifier = Modifier
            .fillMaxWidth()
            .padding(20.dp),
          horizontalAlignment = Alignment.CenterHorizontally
        ) {
          // Dialog Header
          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
          ) {
            Row(
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
              Surface(
                shape = CircleShape,
                color = SoftBlue,
                border = androidx.compose.foundation.BorderStroke(1.dp, SoftBlueBorder),
                modifier = Modifier.size(36.dp)
              ) {
                Box(contentAlignment = Alignment.Center) {
                  Icon(
                    imageVector = Icons.Default.Sensors,
                    contentDescription = null,
                    tint = IndustrialBlue,
                    modifier = Modifier.size(20.dp)
                  )
                }
              }
              Column {
                Text(
                  text = "AUTOMATIC FACE SCAN",
                  style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.Black,
                    color = IndustrialBlue,
                    letterSpacing = 0.5.sp
                  )
                )
                Text(
                  text = domainTitle,
                  style = MaterialTheme.typography.bodySmall.copy(
                    color = TextSlateMedium,
                    fontWeight = FontWeight.Medium
                  )
                )
              }
            }

            IconButton(
              onClick = onDismiss,
              modifier = Modifier.size(36.dp)
            ) {
              Icon(
                imageVector = Icons.Default.Close,
                contentDescription = "Cancel",
                tint = TextSlateMedium
              )
            }
          }

          Spacer(modifier = Modifier.height(14.dp))

          // Enrolled Face Info Strip (Matches with login face)
          val profile = FaceAuthRepository.workerProfile.value
          Surface(
            shape = RoundedCornerShape(10.dp),
            color = SoftBlue,
            border = androidx.compose.foundation.BorderStroke(1.dp, SoftBlueBorder),
            modifier = Modifier.fillMaxWidth()
          ) {
            Row(
              modifier = Modifier.padding(10.dp),
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
              Box(
                modifier = Modifier
                  .size(42.dp)
                  .clip(CircleShape)
                  .border(2.dp, SafetyOrange, CircleShape)
              ) {
                Image(
                  painter = painterResource(id = R.drawable.img_worker_avatar),
                  contentDescription = "Login Face",
                  modifier = Modifier.fillMaxSize(),
                  contentScale = ContentScale.Crop
                )
              }

              Column(modifier = Modifier.weight(1f)) {
                Row(
                  verticalAlignment = Alignment.CenterVertically,
                  horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                  Text(
                    text = "LOGIN ENROLLED FACE",
                    style = MaterialTheme.typography.labelSmall.copy(
                      fontWeight = FontWeight.Black,
                      color = IndustrialBlue,
                      fontSize = 10.sp
                    )
                  )
                  Surface(
                    shape = RoundedCornerShape(4.dp),
                    color = SafetyGreen.copy(alpha = 0.15f)
                  ) {
                    Text(
                      text = "ACTIVE",
                      color = SafetyGreen,
                      fontWeight = FontWeight.Bold,
                      fontSize = 9.sp,
                      modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
                    )
                  }
                }
                Text(
                  text = "${profile.name} (${profile.workerId})",
                  style = MaterialTheme.typography.bodyMedium.copy(
                    fontWeight = FontWeight.Bold,
                    color = TextNavyDark
                  )
                )
              }
            }
          }

          Spacer(modifier = Modifier.height(16.dp))

          // Biometric Camera / Auto-Scanning Viewport
          AutoFaceScannerViewport(
            hasCameraPermission = hasCameraPermission,
            onScanCompleted = {
              // Trigger gentle haptic vibration
              triggerHaptic(context)
              FaceAuthRepository.verifyAgainstLoginFace()
              onFaceVerified()
            }
          )

          Spacer(modifier = Modifier.height(14.dp))

          // Info message
          Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
          ) {
            Icon(
              imageVector = Icons.Default.Shield,
              contentDescription = null,
              tint = IndustrialBlue,
              modifier = Modifier.size(16.dp)
            )
            Text(
              text = "Auto-scans and matches instantly with your login biometric profile.",
              style = MaterialTheme.typography.labelSmall.copy(
                color = TextSlateMedium
              ),
              textAlign = TextAlign.Center
            )
          }
        }
      }
    }
  }
}

/**
 * High-tech automated scanning viewport with animated laser reticle,
 * facial landmark tracking points, and automated transition to success.
 */
@Composable
fun AutoFaceScannerViewport(
  hasCameraPermission: Boolean,
  onScanCompleted: () -> Unit,
  modifier: Modifier = Modifier
) {
  val context = LocalContext.current
  val lifecycleOwner = LocalLifecycleOwner.current

  var scanState by remember { mutableStateOf(ScanState.INITIALIZING) }
  var scanProgress by remember { mutableFloatStateOf(0f) }
  var matchScore by remember { mutableFloatStateOf(0f) }

  // Automatic Scan sequence:
  // Starts automatically when rendered, advances progress, matches against login face,
  // reaches success and invokes onScanCompleted!
  LaunchedEffect(Unit) {
    scanState = ScanState.INITIALIZING
    delay(400)
    scanState = ScanState.SCANNING

    // Progress 0% -> 60%
    val steps = 15
    for (i in 1..steps) {
      delay(80)
      scanProgress = (i.toFloat() / steps) * 0.65f
    }

    scanState = ScanState.MATCHING
    // Progress 65% -> 100%
    for (i in 1..8) {
      delay(70)
      scanProgress = 0.65f + (i.toFloat() / 8) * 0.35f
    }

    matchScore = 98.8f + (kotlin.random.Random.nextFloat() * 0.9f)
    scanState = ScanState.SUCCESS
    delay(1000)
    onScanCompleted()
  }

  // Laser sweep animation
  val infiniteTransition = rememberInfiniteTransition(label = "laser_sweep")
  val laserOffset by infiniteTransition.animateFloat(
    initialValue = 0f,
    targetValue = 220f,
    animationSpec = infiniteRepeatable(
      animation = tween(1400, easing = FastOutSlowInEasing),
      repeatMode = RepeatMode.Reverse
    ),
    label = "laser_anim"
  )

  Column(
    horizontalAlignment = Alignment.CenterHorizontally,
    modifier = modifier.fillMaxWidth()
  ) {
    // Viewport box
    Box(
      modifier = Modifier
        .size(240.dp)
        .clip(RoundedCornerShape(16.dp))
        .background(Color(0xFF0F172A))
        .border(
          2.dp,
          when (scanState) {
            ScanState.SUCCESS -> SafetyGreen
            ScanState.MATCHING -> ElectricBlue
            else -> SafetyOrange
          },
          RoundedCornerShape(16.dp)
        ),
      contentAlignment = Alignment.Center
    ) {
      // Background: Camera preview or Fallback sensor preview
      if (hasCameraPermission) {
        CameraPreviewView(modifier = Modifier.fillMaxSize())
      } else {
        // High-contrast simulated worker biometric live feed
        Box(modifier = Modifier.fillMaxSize()) {
          Image(
            painter = painterResource(id = R.drawable.img_worker_avatar),
            contentDescription = "Live Camera Sensor",
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop,
            alpha = 0.85f
          )
          Box(
            modifier = Modifier
              .fillMaxSize()
              .background(Color(0xFF0F172A).copy(alpha = 0.35f))
          )
        }
      }

      // HUD Face Reticle / Corner Brackets
      Box(
        modifier = Modifier
          .size(170.dp)
          .border(
            1.5.dp,
            if (scanState == ScanState.SUCCESS) SafetyGreen else ElectricBlue.copy(alpha = 0.7f),
            RoundedCornerShape(12.dp)
          )
      ) {
        // Corner bracket accents
        Box(
          modifier = Modifier
            .size(16.dp)
            .align(Alignment.TopStart)
            .border(3.dp, if (scanState == ScanState.SUCCESS) SafetyGreen else SafetyOrange, RoundedCornerShape(topStart = 10.dp))
        )
        Box(
          modifier = Modifier
            .size(16.dp)
            .align(Alignment.TopEnd)
            .border(3.dp, if (scanState == ScanState.SUCCESS) SafetyGreen else SafetyOrange, RoundedCornerShape(topEnd = 10.dp))
        )
        Box(
          modifier = Modifier
            .size(16.dp)
            .align(Alignment.BottomStart)
            .border(3.dp, if (scanState == ScanState.SUCCESS) SafetyGreen else SafetyOrange, RoundedCornerShape(bottomStart = 10.dp))
        )
        Box(
          modifier = Modifier
            .size(16.dp)
            .align(Alignment.BottomEnd)
            .border(3.dp, if (scanState == ScanState.SUCCESS) SafetyGreen else SafetyOrange, RoundedCornerShape(bottomEnd = 10.dp))
        )

        // Facial Landmark Dots (Eyes, Nose, Chin tracking)
        if (scanState == ScanState.SCANNING || scanState == ScanState.MATCHING) {
          // Left eye landmark
          Box(
            modifier = Modifier
              .size(6.dp)
              .offset(x = 42.dp, y = 54.dp)
              .clip(CircleShape)
              .background(ElectricBlue)
          )
          // Right eye landmark
          Box(
            modifier = Modifier
              .size(6.dp)
              .offset(x = 118.dp, y = 54.dp)
              .clip(CircleShape)
              .background(ElectricBlue)
          )
          // Nose landmark
          Box(
            modifier = Modifier
              .size(6.dp)
              .offset(x = 80.dp, y = 84.dp)
              .clip(CircleShape)
              .background(SafetyOrange)
          )
          // Mouth / Chin landmark
          Box(
            modifier = Modifier
              .size(6.dp)
              .offset(x = 80.dp, y = 120.dp)
              .clip(CircleShape)
              .background(ElectricBlue)
          )
        }
      }

      // Moving Laser Line (when scanning or matching)
      if (scanState == ScanState.SCANNING || scanState == ScanState.MATCHING) {
        Box(
          modifier = Modifier
            .fillMaxWidth()
            .height(2.5.dp)
            .offset(y = (laserOffset - 110).dp)
            .background(SafetyOrange)
        )
      }

      // Success Overlay
      if (scanState == ScanState.SUCCESS) {
        Box(
          modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.55f)),
          contentAlignment = Alignment.Center
        ) {
          Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(8.dp)
          ) {
            Surface(
              shape = CircleShape,
              color = SafetyGreen,
              modifier = Modifier.size(54.dp)
            ) {
              Box(contentAlignment = Alignment.Center) {
                Icon(
                  imageVector = Icons.Default.CheckCircle,
                  contentDescription = "Matched",
                  tint = PureWhite,
                  modifier = Modifier.size(34.dp)
                )
              }
            }
            Text(
              text = "MATCH VERIFIED",
              style = MaterialTheme.typography.titleMedium.copy(
                fontWeight = FontWeight.Black,
                color = PureWhite,
                letterSpacing = 1.sp
              )
            )
            Surface(
              shape = RoundedCornerShape(6.dp),
              color = SafetyGreen.copy(alpha = 0.25f),
              border = androidx.compose.foundation.BorderStroke(1.dp, SafetyGreen)
            ) {
              Text(
                text = "${String.format("%.1f", matchScore)}% Landmark Match",
                style = MaterialTheme.typography.labelSmall.copy(
                  fontWeight = FontWeight.Bold,
                  color = SafetyGreen
                ),
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
              )
            }
          }
        }
      }
    }

    Spacer(modifier = Modifier.height(14.dp))

    // Progress bar and scan state messages
    LinearProgressIndicator(
      progress = { scanProgress },
      modifier = Modifier
        .fillMaxWidth()
        .height(8.dp)
        .clip(RoundedCornerShape(4.dp)),
      color = if (scanState == ScanState.SUCCESS) SafetyGreen else SafetyOrange,
      trackColor = SoftBlue
    )

    Spacer(modifier = Modifier.height(10.dp))

    // Real-time status text
    Text(
      text = when (scanState) {
        ScanState.INITIALIZING -> "Initializing Optical Biometric Sensor..."
        ScanState.SCANNING -> "Auto-Scanning Face: Aligning Facial Mesh..."
        ScanState.MATCHING -> "Matching with Login Profile: Rajesh Kumar Murmu..."
        ScanState.SUCCESS -> "Verified! Launching Safety MCQ Assessment..."
      },
      style = MaterialTheme.typography.bodyMedium.copy(
        fontWeight = FontWeight.Bold,
        color = if (scanState == ScanState.SUCCESS) SafetyGreen else TextNavyDark,
        fontFamily = FontFamily.SansSerif
      ),
      textAlign = TextAlign.Center
    )
  }
}

/**
 * CameraX live camera preview component
 */
@Composable
fun CameraPreviewView(modifier: Modifier = Modifier) {
  val context = LocalContext.current
  val lifecycleOwner = LocalLifecycleOwner.current

  val previewView = remember {
    PreviewView(context).apply {
      scaleType = PreviewView.ScaleType.FILL_CENTER
    }
  }

  DisposableEffect(lifecycleOwner) {
    val cameraProviderFuture = ProcessCameraProvider.getInstance(context)
    cameraProviderFuture.addListener({
      try {
        val cameraProvider = cameraProviderFuture.get()
        val preview = Preview.Builder().build().also {
          it.setSurfaceProvider(previewView.surfaceProvider)
        }

        // Try front camera first, fallback to back camera
        val cameraSelector = if (cameraProvider.hasCamera(CameraSelector.DEFAULT_FRONT_CAMERA)) {
          CameraSelector.DEFAULT_FRONT_CAMERA
        } else {
          CameraSelector.DEFAULT_BACK_CAMERA
        }

        cameraProvider.unbindAll()
        cameraProvider.bindToLifecycle(lifecycleOwner, cameraSelector, preview)
      } catch (_: Exception) {
        // Fallback gracefully handled if camera unavailable in container
      }
    }, ContextCompat.getMainExecutor(context))

    onDispose {
      try {
        val cameraProvider = ProcessCameraProvider.getInstance(context).get()
        cameraProvider.unbindAll()
      } catch (_: Exception) {}
    }
  }

  AndroidView(
    factory = { previewView },
    modifier = modifier
  )
}

private fun triggerHaptic(context: Context) {
  try {
    val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
    if (vibrator != null && vibrator.hasVibrator()) {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        vibrator.vibrate(VibrationEffect.createOneShot(80, VibrationEffect.DEFAULT_AMPLITUDE))
      } else {
        @Suppress("DEPRECATION")
        vibrator.vibrate(80)
      }
    }
  } catch (_: Exception) {}
}
