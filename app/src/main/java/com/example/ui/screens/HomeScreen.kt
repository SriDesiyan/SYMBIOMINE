package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Assessment
import androidx.compose.material.icons.filled.Assignment
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.Dangerous
import androidx.compose.material.icons.filled.Face
import androidx.compose.material.icons.filled.HealthAndSafety
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Sensors
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material.icons.filled.ViewInAr
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material.icons.filled.WarningAmber
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.AppStrings
import com.example.data.FaceAuthRepository
import com.example.ui.components.HazardStripeBar
import com.example.utils.UnityArLauncher
import kotlinx.coroutines.launch
import com.example.ui.theme.CleanCanvas
import com.example.ui.theme.ElectricBlue
import com.example.ui.theme.IndustrialBlue
import com.example.ui.theme.IndustrialCardBorder
import com.example.ui.theme.PureWhite
import com.example.ui.theme.RoyalBlue
import com.example.ui.theme.SafetyGreen
import com.example.ui.theme.SafetyOrange
import com.example.ui.theme.SafetyOrangeDark
import com.example.ui.theme.SafetyOrangeSubtle
import com.example.ui.theme.SoftBlue
import com.example.ui.theme.SoftBlueBorder
import com.example.ui.theme.SoftSurface
import com.example.ui.theme.TextNavyDark
import com.example.ui.theme.TextSlateMedium
import com.example.ui.theme.TextSlateMuted

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
  strings: AppStrings,
  onNavigateToProfile: () -> Unit,
  onNavigateToSettings: () -> Unit,
  onNavigateToModule: (String) -> Unit
) {
  val context = LocalContext.current
  val scope = rememberCoroutineScope()
  val snackbarHostState = remember { SnackbarHostState() }
  val certifications by FaceAuthRepository.moduleCertifications.collectAsState()
  val workerProfile by FaceAuthRepository.workerProfile.collectAsState()

  Box(
    modifier = Modifier
      .fillMaxSize()
      .background(CleanCanvas)
  ) {
    Column(modifier = Modifier.fillMaxSize()) {
      // Top Enterprise Header Bar
      Surface(
        modifier = Modifier.fillMaxWidth(),
        color = PureWhite,
        shadowElevation = 2.dp
      ) {
        Column(modifier = Modifier.statusBarsPadding()) {
          Row(
            modifier = Modifier
              .fillMaxWidth()
              .padding(horizontal = 14.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
          ) {
            // App Branding Title
            Row(
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
              Surface(
                modifier = Modifier
                  .size(38.dp)
                  .clip(RoundedCornerShape(8.dp)),
                color = SoftBlue,
                border = androidx.compose.foundation.BorderStroke(1.dp, SoftBlueBorder)
              ) {
                Box(contentAlignment = Alignment.Center) {
                  Icon(
                    imageVector = Icons.Default.Shield,
                    contentDescription = null,
                    tint = IndustrialBlue,
                    modifier = Modifier.size(22.dp)
                  )
                }
              }

              Column {
                Row(verticalAlignment = Alignment.CenterVertically) {
                  Text(
                    text = "SymbioMine",
                    style = MaterialTheme.typography.titleMedium.copy(
                      fontWeight = FontWeight.Black,
                      color = TextNavyDark
                    )
                  )
                  Spacer(modifier = Modifier.width(4.dp))
                  Surface(
                    shape = RoundedCornerShape(3.dp),
                    color = SafetyOrange
                  ) {
                    Text(
                      text = "AR",
                      color = Color.White,
                      fontWeight = FontWeight.Black,
                      fontSize = 10.sp,
                      modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
                    )
                  }
                  Spacer(modifier = Modifier.width(6.dp))
                  Surface(
                    shape = RoundedCornerShape(3.dp),
                    color = SafetyOrangeSubtle,
                    border = androidx.compose.foundation.BorderStroke(1.dp, SafetyOrange.copy(alpha = 0.4f))
                  ) {
                    Text(
                      text = "ENTERPRISE",
                      color = SafetyOrangeDark,
                      fontWeight = FontWeight.Bold,
                      fontSize = 9.sp,
                      modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
                    )
                  }
                }
                Text(
                  text = "INDUSTRIAL SAFETY COMPETENCY PLATFORM",
                  style = MaterialTheme.typography.labelSmall.copy(
                    fontSize = 8.5.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextSlateMedium,
                    letterSpacing = 0.5.sp
                  )
                )
              }
            }

            // Right: Worker Avatar & ID Badge + Settings
            Row(
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
              Surface(
                modifier = Modifier
                  .clip(RoundedCornerShape(8.dp))
                  .clickable { onNavigateToProfile() }
                  .border(1.dp, SoftBlueBorder, RoundedCornerShape(8.dp)),
                color = SoftSurface
              ) {
                Row(
                  modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                  verticalAlignment = Alignment.CenterVertically,
                  horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                  Surface(
                    shape = CircleShape,
                    color = IndustrialBlue,
                    modifier = Modifier.size(24.dp)
                  ) {
                    Box(contentAlignment = Alignment.Center) {
                      Icon(
                        imageVector = Icons.Default.Person,
                        contentDescription = "Profile",
                        tint = PureWhite,
                        modifier = Modifier.size(16.dp)
                      )
                    }
                  }
                  Column {
                    Text(
                      text = workerProfile.workerId,
                      style = MaterialTheme.typography.labelSmall.copy(
                        fontWeight = FontWeight.Black,
                        color = IndustrialBlue,
                        fontSize = 9.5.sp
                      )
                    )
                    Text(
                      text = "VERIFIED",
                      style = MaterialTheme.typography.labelSmall.copy(
                        fontWeight = FontWeight.Bold,
                        color = SafetyGreen,
                        fontSize = 7.5.sp
                      )
                    )
                  }
                }
              }

              IconButton(
                onClick = onNavigateToSettings,
                modifier = Modifier.size(36.dp)
              ) {
                Icon(
                  imageVector = Icons.Default.Settings,
                  contentDescription = "Settings",
                  tint = IndustrialBlue,
                  modifier = Modifier.size(20.dp)
                )
              }
            }
          }

          HazardStripeBar(stripeHeight = 2.5.dp)

          // Navigation Tabs: HOME, MODULES, ASSESSMENT
          Row(
            modifier = Modifier
              .fillMaxWidth()
              .background(PureWhite)
              .padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
          ) {
            NavTabItem(
              title = "HOME",
              icon = Icons.Default.Shield,
              isSelected = true,
              onClick = {}
            )
            NavTabItem(
              title = "MODULES",
              icon = Icons.Default.Assignment,
              isSelected = false,
              onClick = { onNavigateToModule("fire_extinguisher") }
            )
            NavTabItem(
              title = "ASSESSMENT",
              icon = Icons.Default.Assessment,
              isSelected = false,
              onClick = { onNavigateToModule("fire_extinguisher") }
            )
          }
        }
      }

      // Main Content
      LazyColumn(
        modifier = Modifier
          .fillMaxSize()
          .weight(1f),
        contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 14.dp, bottom = 24.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
      ) {
        // Training Modules Header Banner with Audio Icon
        item {
          Surface(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(14.dp),
            color = PureWhite,
            border = androidx.compose.foundation.BorderStroke(1.dp, IndustrialCardBorder),
            shadowElevation = 1.dp
          ) {
            Row(
              modifier = Modifier.padding(14.dp),
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.SpaceBetween
            ) {
              Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
              ) {
                Surface(
                  modifier = Modifier.size(46.dp),
                  shape = RoundedCornerShape(10.dp),
                  color = SafetyOrangeSubtle,
                  border = androidx.compose.foundation.BorderStroke(1.dp, SafetyOrange.copy(alpha = 0.4f))
                ) {
                  Box(contentAlignment = Alignment.Center) {
                    Icon(
                      imageVector = Icons.Default.Shield,
                      contentDescription = null,
                      tint = SafetyOrange,
                      modifier = Modifier.size(24.dp)
                    )
                  }
                }

                Column {
                  Text(
                    text = "TRAINING MODULES",
                    style = MaterialTheme.typography.titleMedium.copy(
                      fontWeight = FontWeight.Black,
                      letterSpacing = 0.5.sp,
                      color = TextNavyDark
                    )
                  )
                  Text(
                    text = "Core Industrial Competency Curriculum",
                    style = MaterialTheme.typography.bodySmall.copy(
                      color = TextSlateMedium,
                      fontWeight = FontWeight.Medium
                    )
                  )
                }
              }

              Surface(
                shape = CircleShape,
                color = SoftBlue,
                modifier = Modifier.size(36.dp)
              ) {
                Box(contentAlignment = Alignment.Center) {
                  Icon(
                    imageVector = Icons.Default.VolumeUp,
                    contentDescription = "Voice Assistance",
                    tint = IndustrialBlue,
                    modifier = Modifier.size(20.dp)
                  )
                }
              }
            }
          }
        }

        // MODULE 01 — Fire Safety & Extinguisher (Target Unity APK: com.sybioar.symbiofire)
        item {
          EnterpriseModuleCard(
            moduleId = "fire_extinguisher",
            moduleNumber = 1,
            title = "Fire Safety & Extinguisher",
            subtitle = "10 Questions • 100 Marks • Passing: 80%",
            arInstruction = "Execute PASS protocol: Pull pin, Aim nozzle at fire base, Squeeze trigger, and Sweep.",
            icon = Icons.Default.LocalFireDepartment,
            accentColor = SafetyOrange,
            certification = certifications["fire_extinguisher"],
            onTakeMcq = { onNavigateToModule("fire_extinguisher") },
            onLaunchAr = {
              UnityArLauncher.launchUnityAr(context, "fire_extinguisher") { msg ->
                scope.launch { snackbarHostState.showSnackbar(msg) }
              }
            },
            onViewResult = { onNavigateToModule("fire_extinguisher") }
          )
        }

        // MODULE 02 — Gas Leak & Lockout Tagout
        item {
          EnterpriseModuleCard(
            moduleId = "gas_leakage",
            moduleNumber = 2,
            title = "Gas Leak & Lockout Tagout",
            subtitle = "10 Questions • 100 Marks • Passing: 80%",
            arInstruction = "Perform gas leak isolation: Verify gas levels, Close isolation valve, and Apply safety padlock.",
            icon = Icons.Default.Sensors,
            accentColor = ElectricBlue,
            certification = certifications["gas_leakage"],
            onTakeMcq = { onNavigateToModule("gas_leakage") },
            onLaunchAr = {
              UnityArLauncher.launchUnityAr(context, "gas_leakage") { msg ->
                scope.launch { snackbarHostState.showSnackbar(msg) }
              }
            },
            onViewResult = { onNavigateToModule("gas_leakage") }
          )
        }

        // MODULE 03 — Confined Space & Machinery Safety
        item {
          EnterpriseModuleCard(
            moduleId = "confined_space",
            moduleNumber = 3,
            title = "Confined Space & Machinery",
            subtitle = "10 Questions • 100 Marks • Passing: 80%",
            arInstruction = "Execute Confined Space LOTO: Atmospheric test, Tri-pod winch, Standby communication.",
            icon = Icons.Default.Dangerous,
            accentColor = IndustrialBlue,
            certification = certifications["confined_space"],
            onTakeMcq = { onNavigateToModule("confined_space") },
            onLaunchAr = {
              UnityArLauncher.launchUnityAr(context, "confined_space") { msg ->
                scope.launch { snackbarHostState.showSnackbar(msg) }
              }
            },
            onViewResult = { onNavigateToModule("confined_space") }
          )
        }

        // MODULE 04 — PPE & Emergency Response
        item {
          EnterpriseModuleCard(
            moduleId = "ppe_emergency",
            moduleNumber = 4,
            title = "PPE & Emergency Response",
            subtitle = "10 Questions • 100 Marks • Passing: 80%",
            arInstruction = "PPE & Emergency Response: Class E helmet, Metatarsal boots, SCSR, Refuge chamber.",
            icon = Icons.Default.HealthAndSafety,
            accentColor = RoyalBlue,
            certification = certifications["ppe_emergency"],
            onTakeMcq = { onNavigateToModule("ppe_emergency") },
            onLaunchAr = {
              UnityArLauncher.launchUnityAr(context, "ppe_emergency") { msg ->
                scope.launch { snackbarHostState.showSnackbar(msg) }
              }
            },
            onViewResult = { onNavigateToModule("ppe_emergency") }
          )
        }
      }

      SnackbarHost(hostState = snackbarHostState)
    }
  }
}

@Composable
fun NavTabItem(
  title: String,
  icon: ImageVector,
  isSelected: Boolean,
  onClick: () -> Unit
) {
  Row(
    modifier = Modifier
      .clip(RoundedCornerShape(8.dp))
      .clickable { onClick() }
      .padding(horizontal = 10.dp, vertical = 6.dp),
    verticalAlignment = Alignment.CenterVertically,
    horizontalArrangement = Arrangement.spacedBy(6.dp)
  ) {
    Icon(
      imageVector = icon,
      contentDescription = title,
      tint = if (isSelected) SafetyOrange else TextSlateMedium,
      modifier = Modifier.size(18.dp)
    )
    Text(
      text = title,
      style = MaterialTheme.typography.labelMedium.copy(
        fontWeight = if (isSelected) FontWeight.Black else FontWeight.Bold,
        color = if (isSelected) SafetyOrange else TextNavyDark,
        letterSpacing = 0.5.sp
      )
    )
  }
}

/**
 * Enterprise Module Card with AR Target Instruction and 3 Interactive Action Buttons:
 * [Take MCQ] [Launch AR] [Result]
 */
@Composable
fun EnterpriseModuleCard(
  moduleId: String,
  moduleNumber: Int,
  title: String,
  subtitle: String,
  arInstruction: String,
  icon: ImageVector,
  accentColor: Color,
  certification: com.example.data.ModuleCertification? = null,
  onTakeMcq: () -> Unit,
  onLaunchAr: () -> Unit,
  onViewResult: () -> Unit
) {
  Card(
    modifier = Modifier
      .fillMaxWidth()
      .testTag("module_card_$moduleId"),
    shape = RoundedCornerShape(16.dp),
    colors = CardDefaults.cardColors(containerColor = PureWhite),
    border = androidx.compose.foundation.BorderStroke(1.dp, IndustrialCardBorder),
    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
  ) {
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .padding(16.dp),
      verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
      // Header: MODULE 01 & Status Badge (NOT STARTED / CERTIFIED / RETAKE)
      Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
      ) {
        Text(
          text = "MODULE 0$moduleNumber",
          style = MaterialTheme.typography.labelSmall.copy(
            fontWeight = FontWeight.Black,
            color = TextSlateMedium,
            letterSpacing = 0.8.sp
          )
        )

        Surface(
          shape = RoundedCornerShape(6.dp),
          color = when {
            certification != null && certification.isPassed -> SafetyGreen.copy(alpha = 0.15f)
            certification != null && certification.scorePercentage > 0 -> SafetyOrangeSubtle
            else -> SoftBlue
          }
        ) {
          Text(
            text = when {
              certification != null && certification.isPassed -> "PASSED (${certification.scorePercentage}%)"
              certification != null && certification.scorePercentage > 0 -> "SCORE: ${certification.scorePercentage}%"
              else -> "NOT STARTED"
            },
            style = MaterialTheme.typography.labelSmall.copy(
              fontWeight = FontWeight.Bold,
              color = when {
                certification != null && certification.isPassed -> SafetyGreen
                certification != null && certification.scorePercentage > 0 -> SafetyOrangeDark
                else -> IndustrialBlue
              },
              fontSize = 9.5.sp
            ),
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
          )
        }
      }

      // Title Row with Icon
      Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp)
      ) {
        Surface(
          modifier = Modifier.size(52.dp),
          shape = RoundedCornerShape(12.dp),
          color = accentColor.copy(alpha = 0.12f),
          border = androidx.compose.foundation.BorderStroke(1.5.dp, accentColor.copy(alpha = 0.6f))
        ) {
          Box(contentAlignment = Alignment.Center) {
            Icon(
              imageVector = icon,
              contentDescription = null,
              tint = accentColor,
              modifier = Modifier.size(28.dp)
            )
          }
        }

        Column(modifier = Modifier.weight(1f)) {
          Text(
            text = title,
            style = MaterialTheme.typography.titleMedium.copy(
              fontWeight = FontWeight.Bold,
              color = TextNavyDark
            )
          )
          Spacer(modifier = Modifier.height(2.dp))
          Text(
            text = subtitle,
            style = MaterialTheme.typography.bodySmall.copy(
              color = TextSlateMedium,
              fontSize = 11.5.sp
            )
          )
        }
      }

      // AR TARGET INSTRUCTION Box
      Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(10.dp),
        color = SoftSurface,
        border = androidx.compose.foundation.BorderStroke(1.dp, SoftBlueBorder)
      ) {
        Column(
          modifier = Modifier.padding(10.dp),
          verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
          Text(
            text = "AR TARGET INSTRUCTION",
            style = MaterialTheme.typography.labelSmall.copy(
              fontWeight = FontWeight.Black,
              color = TextSlateMedium,
              fontSize = 9.sp,
              letterSpacing = 0.5.sp
            )
          )
          Text(
            text = arInstruction,
            style = MaterialTheme.typography.bodySmall.copy(
              color = TextNavyDark,
              fontWeight = FontWeight.Medium,
              lineHeight = 16.sp
            )
          )
        }
      }

      // 3 Action Buttons: [ Take MCQ ] [ Launch AR ] [ Result ]
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically
      ) {
        // 1. Take MCQ (Safety Orange)
        Button(
          onClick = onTakeMcq,
          modifier = Modifier
            .weight(1f)
            .height(44.dp)
            .testTag("btn_take_mcq_$moduleId"),
          shape = RoundedCornerShape(8.dp),
          colors = ButtonDefaults.buttonColors(
            containerColor = SafetyOrange,
            contentColor = PureWhite
          ),
          contentPadding = PaddingValues(horizontal = 8.dp)
        ) {
          Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
          ) {
            Icon(
              imageVector = Icons.Default.Assignment,
              contentDescription = null,
              modifier = Modifier.size(16.dp),
              tint = PureWhite
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
              text = "Take MCQ",
              style = MaterialTheme.typography.labelMedium.copy(
                fontWeight = FontWeight.Bold,
                fontSize = 12.sp
              )
            )
          }
        }

        // 2. Launch AR (Unity Subsystem Trigger)
        OutlinedButton(
          onClick = onLaunchAr,
          modifier = Modifier
            .weight(1f)
            .height(44.dp)
            .testTag("btn_launch_ar_$moduleId"),
          shape = RoundedCornerShape(8.dp),
          border = androidx.compose.foundation.BorderStroke(1.5.dp, SoftBlueBorder),
          colors = ButtonDefaults.outlinedButtonColors(
            containerColor = PureWhite,
            contentColor = TextNavyDark
          ),
          contentPadding = PaddingValues(horizontal = 8.dp)
        ) {
          Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
          ) {
            Icon(
              imageVector = Icons.Default.CameraAlt,
              contentDescription = null,
              modifier = Modifier.size(16.dp),
              tint = IndustrialBlue
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
              text = "Launch AR",
              style = MaterialTheme.typography.labelMedium.copy(
                fontWeight = FontWeight.Bold,
                fontSize = 12.sp,
                color = TextNavyDark
              )
            )
          }
        }

        // 3. Result
        Surface(
          modifier = Modifier
            .weight(0.9f)
            .height(44.dp)
            .clip(RoundedCornerShape(8.dp))
            .clickable { onViewResult() }
            .border(1.dp, SoftBlueBorder, RoundedCornerShape(8.dp)),
          color = SoftBlue
        ) {
          Box(contentAlignment = Alignment.Center) {
            Text(
              text = "Result",
              style = MaterialTheme.typography.labelMedium.copy(
                fontWeight = FontWeight.Bold,
                color = IndustrialBlue,
                fontSize = 12.sp
              )
            )
          }
        }
      }
    }
  }
}
