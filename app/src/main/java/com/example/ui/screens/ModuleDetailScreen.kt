package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Assignment
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Dangerous
import androidx.compose.material.icons.filled.Face
import androidx.compose.material.icons.filled.HealthAndSafety
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Sensors
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material.icons.filled.ViewInAr
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.AppStrings
import com.example.data.FaceAuthRepository
import com.example.ui.components.AutoFaceScannerDialog
import com.example.ui.components.HazardStripeBar
import com.example.ui.components.IndustrialOutlineButton
import com.example.ui.components.IndustrialPrimaryButton
import com.example.utils.UnityArLauncher
import com.example.ui.theme.CleanCanvas
import com.example.ui.theme.ElectricBlue
import com.example.ui.theme.IndustrialBlue
import com.example.ui.theme.IndustrialCardBorder
import com.example.ui.theme.PureWhite
import com.example.ui.theme.RoyalBlue
import com.example.ui.theme.SafetyGreen
import com.example.ui.theme.SafetyOrange
import com.example.ui.theme.SafetyOrangeBorder
import com.example.ui.theme.SafetyOrangeDark
import com.example.ui.theme.SafetyOrangeSubtle
import com.example.ui.theme.SoftBlue
import com.example.ui.theme.SoftBlueBorder
import com.example.ui.theme.SoftSurface
import com.example.ui.theme.TextNavyDark
import com.example.ui.theme.TextSlateMedium
import com.example.ui.theme.TextSlateMuted
import kotlinx.coroutines.launch

data class ModuleInfo(
  val id: String,
  val number: Int,
  val title: String,
  val description: String,
  val icon: ImageVector,
  val accentColor: Color,
  val objectives: List<String>,
  val arSceneName: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ModuleDetailScreen(
  moduleId: String,
  strings: AppStrings,
  onStartAssessment: (String) -> Unit,
  onBack: () -> Unit
) {
  val context = LocalContext.current
  var showFaceAuthDialog by remember { mutableStateOf(false) }
  val certifications by FaceAuthRepository.moduleCertifications.collectAsState()
  val currentCert = certifications[moduleId]
  val moduleInfo = remember(moduleId, strings) {
    when (moduleId) {
      "fire_extinguisher" -> ModuleInfo(
        id = moduleId,
        number = 1,
        title = strings.mod1Title,
        description = strings.mod1Desc,
        icon = Icons.Default.LocalFireDepartment,
        accentColor = SafetyOrange,
        objectives = listOf(
          "P.A.S.S. Technique: Pull pin, Aim nozzle, Squeeze handle, Sweep base of fire",
          "Identify Class A, B, C & electrical fire extinguisher classifications",
          "Underground ventilation control and air curtain positioning",
          "Emergency radio dispatch to mine rescue brigade"
        ),
        arSceneName = "Scene_FireExtinguisher_MineShaft"
      )
      "gas_leakage" -> ModuleInfo(
        id = moduleId,
        number = 2,
        title = strings.mod2Title,
        description = strings.mod2Desc,
        icon = Icons.Default.Sensors,
        accentColor = ElectricBlue,
        objectives = listOf(
          "Calibrate multi-gas detector for CH4, CO, H2S & O2 concentration",
          "Recognize explosive lower explosive limit (LEL) warning thresholds",
          "Rapid donning of Self-Contained Self-Rescuer (SCSR) within 30 seconds",
          "Navigate escapeway with lifeline tactile markers in low-visibility gas"
        ),
        arSceneName = "Scene_GasLeak_TunnelVentilation"
      )
      "confined_space" -> ModuleInfo(
        id = moduleId,
        number = 3,
        title = strings.mod3Title,
        description = strings.mod3Desc,
        icon = Icons.Default.Dangerous,
        accentColor = IndustrialBlue,
        objectives = listOf(
          "Mandatory continuous gas testing before entering stope or ore pass",
          "Lockout / Tagout (LOTO) verification on conveyors and crushers",
          "Attendant standby communications and safety harness tethering",
          "Emergency extraction tripod and mechanical hoist rigging"
        ),
        arSceneName = "Scene_ConfinedSpace_ChuteDrill"
      )
      else -> ModuleInfo(
        id = "ppe_emergency",
        number = 4,
        title = strings.mod4Title,
        description = strings.mod4Desc,
        icon = Icons.Default.HealthAndSafety,
        accentColor = RoyalBlue,
        objectives = listOf(
          "Comprehensive PPE audit: Hard hat, metatarsal boots, eye & ear protection",
          "Cap lamp inspection and secondary emergency glowstick verification",
          "High-vis reflective striping visibility check for underground vehicle paths",
          "Muster station assembly and automated biometric roll-call check"
        ),
        arSceneName = "Scene_PPE_EvacuationProtocol"
      )
    }
  }

  val snackbarHostState = remember { SnackbarHostState() }
  val scope = rememberCoroutineScope()

  Box(
    modifier = Modifier
      .fillMaxSize()
      .background(CleanCanvas)
  ) {
    Column(modifier = Modifier.fillMaxSize()) {
      // Top Bar with Back Button
      TopAppBar(
        title = {
          Text(
            text = "Module 0${moduleInfo.number}",
            style = MaterialTheme.typography.titleMedium.copy(
              fontWeight = FontWeight.Bold,
              color = IndustrialBlue
            )
          )
        },
        navigationIcon = {
          IconButton(
            onClick = onBack,
            modifier = Modifier
              .size(48.dp)
              .testTag("module_back_button")
          ) {
            Icon(
              imageVector = Icons.AutoMirrored.Filled.ArrowBack,
              contentDescription = "Back to Home",
              tint = IndustrialBlue
            )
          }
        },
        colors = TopAppBarDefaults.topAppBarColors(
          containerColor = PureWhite
        ),
        modifier = Modifier.statusBarsPadding()
      )

      HazardStripeBar(stripeHeight = 3.dp)

      LazyColumn(
        modifier = Modifier
          .fillMaxSize()
          .weight(1f),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
      ) {
        // Header Overview Card
        item {
          Card(
            modifier = Modifier
              .fillMaxWidth()
              .testTag("module_header_card"),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = PureWhite),
            border = androidx.compose.foundation.BorderStroke(1.dp, IndustrialCardBorder),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
          ) {
            Column(
              modifier = Modifier
                .fillMaxWidth()
                .padding(18.dp)
            ) {
              Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
              ) {
                Surface(
                  modifier = Modifier.size(56.dp),
                  shape = RoundedCornerShape(12.dp),
                  color = moduleInfo.accentColor.copy(alpha = 0.12f),
                  border = androidx.compose.foundation.BorderStroke(1.5.dp, moduleInfo.accentColor.copy(alpha = 0.6f))
                ) {
                  Box(contentAlignment = Alignment.Center) {
                    Icon(
                      imageVector = moduleInfo.icon,
                      contentDescription = null,
                      tint = moduleInfo.accentColor,
                      modifier = Modifier.size(32.dp)
                    )
                  }
                }

                Column(modifier = Modifier.weight(1f)) {
                  Surface(
                    shape = RoundedCornerShape(4.dp),
                    color = SoftBlue,
                    border = androidx.compose.foundation.BorderStroke(1.dp, SoftBlueBorder)
                  ) {
                    Text(
                      text = "SAFETY DRILL 0${moduleInfo.number}",
                      style = MaterialTheme.typography.labelSmall.copy(
                        color = moduleInfo.accentColor,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                      ),
                      modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                  }
                  Spacer(modifier = Modifier.height(4.dp))
                  Text(
                    text = moduleInfo.title,
                    style = MaterialTheme.typography.titleLarge.copy(
                      fontWeight = FontWeight.Bold,
                      color = TextNavyDark
                    )
                  )
                }
              }

              Spacer(modifier = Modifier.height(12.dp))

              Text(
                text = moduleInfo.description,
                style = MaterialTheme.typography.bodyMedium.copy(
                  color = TextSlateMedium,
                  lineHeight = 22.sp
                )
              )
            }
          }
        }

        // Unity AR Module Placeholder Notice Card
        item {
          Card(
            modifier = Modifier
              .fillMaxWidth()
              .testTag("module_ar_placeholder_card"),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(
              containerColor = SafetyOrangeSubtle
            ),
            border = androidx.compose.foundation.BorderStroke(1.5.dp, SafetyOrangeBorder),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
          ) {
            Column(
              modifier = Modifier
                .fillMaxWidth()
                .padding(18.dp)
            ) {
              Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp)
              ) {
                Icon(
                  imageVector = Icons.Default.ViewInAr,
                  contentDescription = null,
                  tint = SafetyOrange,
                  modifier = Modifier.size(26.dp)
                )
                Text(
                  text = strings.arSimulationNotice,
                  style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.Bold,
                    color = SafetyOrangeDark
                  )
                )
              }

              Spacer(modifier = Modifier.height(8.dp))

              Text(
                text = "Unity AR integration point placeholder. In the next deployment phase, tapping Start will invoke the Unity 3D AR runtime module: [${moduleInfo.arSceneName}] to stream the immersive training scenario.",
                style = MaterialTheme.typography.bodyMedium.copy(
                  color = TextNavyDark,
                  lineHeight = 20.sp
                )
              )

              Spacer(modifier = Modifier.height(12.dp))

              Surface(
                shape = RoundedCornerShape(8.dp),
                color = PureWhite,
                border = androidx.compose.foundation.BorderStroke(1.dp, SoftBlueBorder),
                modifier = Modifier.fillMaxWidth()
              ) {
                Row(
                  modifier = Modifier.padding(12.dp),
                  verticalAlignment = Alignment.CenterVertically,
                  horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                  Icon(
                    imageVector = Icons.Default.CheckCircle,
                    contentDescription = null,
                    tint = IndustrialBlue,
                    modifier = Modifier.size(18.dp)
                  )
                  Text(
                    text = strings.arStatusReady,
                    style = MaterialTheme.typography.bodySmall.copy(
                      color = IndustrialBlue,
                      fontWeight = FontWeight.Bold
                    )
                  )
                }
              }
            }
          }
        }

        // Safety Drill Objectives Checklist
        item {
          Card(
            modifier = Modifier
              .fillMaxWidth()
              .testTag("module_objectives_card"),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = PureWhite),
            border = androidx.compose.foundation.BorderStroke(1.dp, IndustrialCardBorder),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
          ) {
            Column(
              modifier = Modifier
                .fillMaxWidth()
                .padding(18.dp),
              verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
              Text(
                text = strings.arRequirementsHeader,
                style = MaterialTheme.typography.titleMedium.copy(
                  fontWeight = FontWeight.Bold,
                  color = TextNavyDark
                )
              )

              moduleInfo.objectives.forEachIndexed { index, objective ->
                Row(
                  modifier = Modifier
                    .fillMaxWidth()
                    .background(SoftSurface, RoundedCornerShape(8.dp))
                    .border(1.dp, IndustrialCardBorder, RoundedCornerShape(8.dp))
                    .padding(10.dp),
                  verticalAlignment = Alignment.Top,
                  horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                  Surface(
                    shape = RoundedCornerShape(4.dp),
                    color = SoftBlue,
                    border = androidx.compose.foundation.BorderStroke(1.dp, SoftBlueBorder),
                    modifier = Modifier.size(24.dp)
                  ) {
                    Box(contentAlignment = Alignment.Center) {
                      Text(
                        text = "${index + 1}",
                        style = MaterialTheme.typography.labelSmall.copy(
                          fontWeight = FontWeight.Bold,
                          color = IndustrialBlue
                        )
                      )
                    }
                  }

                  Text(
                    text = objective,
                    style = MaterialTheme.typography.bodyMedium.copy(
                      color = TextNavyDark,
                      lineHeight = 20.sp
                    ),
                    modifier = Modifier.weight(1f)
                  )
                }
              }
            }
          }
        }

        // Domain-Specific MCQ Safety Assessment Card
        item {
          Card(
            modifier = Modifier
              .fillMaxWidth()
              .testTag("module_assessment_card"),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = PureWhite),
            border = androidx.compose.foundation.BorderStroke(1.5.dp, SoftBlueBorder),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
          ) {
            Column(
              modifier = Modifier
                .fillMaxWidth()
                .padding(18.dp),
              verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
              Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
              ) {
                Row(
                  verticalAlignment = Alignment.CenterVertically,
                  horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                  Icon(
                    imageVector = Icons.Default.Sensors,
                    contentDescription = null,
                    tint = IndustrialBlue,
                    modifier = Modifier.size(22.dp)
                  )
                  Text(
                    text = "SAFETY MCQ ASSESSMENT",
                    style = MaterialTheme.typography.titleMedium.copy(
                      fontWeight = FontWeight.Black,
                      color = TextNavyDark
                    )
                  )
                }

                if (currentCert != null && currentCert.isPassed) {
                  Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = SafetyGreen.copy(alpha = 0.15f)
                  ) {
                    Text(
                      text = "PASSED (${currentCert.scorePercentage}%)",
                      style = MaterialTheme.typography.labelSmall.copy(
                        fontWeight = FontWeight.Bold,
                        color = SafetyGreen
                      ),
                      modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                    )
                  }
                }
              }

              Text(
                text = "Each assessment tests safety procedures with 5 randomized multiple-choice questions drawn from this domain's question pool. Optical biometric face scan matches your login profile automatically before starting.",
                style = MaterialTheme.typography.bodyMedium.copy(
                  color = TextSlateMedium,
                  lineHeight = 20.sp
                )
              )

              Surface(
                shape = RoundedCornerShape(8.dp),
                color = SoftBlue,
                border = androidx.compose.foundation.BorderStroke(1.dp, SoftBlueBorder),
                modifier = Modifier.fillMaxWidth()
              ) {
                Row(
                  modifier = Modifier.padding(10.dp),
                  verticalAlignment = Alignment.CenterVertically,
                  horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                  Icon(
                    imageVector = Icons.Default.Verified,
                    contentDescription = null,
                    tint = IndustrialBlue,
                    modifier = Modifier.size(16.dp)
                  )
                  Text(
                    text = "Requires 80% passing grade for DGMS Compliance Certificate.",
                    style = MaterialTheme.typography.bodySmall.copy(
                      color = IndustrialBlue,
                      fontWeight = FontWeight.SemiBold
                    )
                  )
                }
              }

              IndustrialPrimaryButton(
                text = strings.startAssessmentButton,
                onClick = { showFaceAuthDialog = true },
                icon = Icons.Default.Assignment,
                testTag = "module_start_assessment_button"
              )
            }
          }
        }
      }

      // Bottom Sticky Action Bar
      Surface(
        modifier = Modifier
          .fillMaxWidth()
          .border(androidx.compose.foundation.BorderStroke(1.dp, IndustrialCardBorder)),
        color = PureWhite,
        shadowElevation = 8.dp
      ) {
        Column(
          modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
          verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
          IndustrialPrimaryButton(
            text = strings.startAssessmentButton,
            onClick = { showFaceAuthDialog = true },
            icon = Icons.Default.Sensors,
            testTag = "module_bottom_start_assessment_button"
          )

          IndustrialOutlineButton(
            text = strings.launchArSimButton,
            onClick = {
              UnityArLauncher.launchUnityAr(context, moduleId) { statusMsg ->
                scope.launch {
                  snackbarHostState.showSnackbar(statusMsg)
                }
              }
            },
            icon = Icons.Default.ViewInAr,
            testTag = "module_launch_ar_button"
          )

          IndustrialOutlineButton(
            text = strings.backToHomeButton,
            onClick = onBack,
            testTag = "module_return_home_button"
          )
        }
      }

      SnackbarHost(hostState = snackbarHostState)
    }

    // Automatic Face Scanner Dialog before starting the Domain MCQ Drill
    if (showFaceAuthDialog) {
      AutoFaceScannerDialog(
        domainTitle = moduleInfo.title,
        onFaceVerified = {
          showFaceAuthDialog = false
          onStartAssessment(moduleId)
        },
        onDismiss = { showFaceAuthDialog = false }
      )
    }
  }
}
