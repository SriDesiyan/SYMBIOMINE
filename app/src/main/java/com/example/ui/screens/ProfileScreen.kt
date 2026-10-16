package com.example.ui.screens

import androidx.compose.foundation.Image
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Badge
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Face
import androidx.compose.material.icons.filled.Pending
import androidx.compose.material.icons.filled.Sensors
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material.icons.filled.VerifiedUser
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.R
import com.example.data.AppStrings
import com.example.data.FaceAuthRepository
import com.example.ui.components.AutoFaceScannerDialog
import com.example.ui.components.HazardStripeBar
import com.example.ui.components.IndustrialPrimaryButton
import com.example.ui.theme.CleanCanvas
import com.example.ui.theme.HazardAmber
import com.example.ui.theme.IndustrialBlue
import com.example.ui.theme.IndustrialCardBorder
import com.example.ui.theme.IndustrialDivider
import com.example.ui.theme.PureWhite
import com.example.ui.theme.SafetyGreen
import com.example.ui.theme.SafetyOrange
import com.example.ui.theme.SoftBlue
import com.example.ui.theme.SoftBlueBorder
import com.example.ui.theme.SoftSurface
import com.example.ui.theme.TextNavyDark
import com.example.ui.theme.TextSlateMedium
import com.example.ui.theme.TextSlateMuted

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
  strings: AppStrings,
  onBack: () -> Unit
) {
  val workerProfile by FaceAuthRepository.workerProfile.collectAsState()
  val certifications by FaceAuthRepository.moduleCertifications.collectAsState()
  var showTestFaceScanDialog by remember { mutableStateOf(false) }

  val passedCount = certifications.values.count { it.isPassed }
  val totalCount = certifications.size
  val progressFraction = if (totalCount > 0) passedCount.toFloat() / totalCount else 0.75f
  val progressPercentage = (progressFraction * 100).toInt()
  Box(
    modifier = Modifier
      .fillMaxSize()
      .background(CleanCanvas)
  ) {
    Column(modifier = Modifier.fillMaxSize()) {
      // Top Bar (White with Industrial Blue title)
      TopAppBar(
        title = {
          Text(
            text = strings.profileTitle,
            style = MaterialTheme.typography.titleLarge.copy(
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
              .testTag("profile_back_button")
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
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
      ) {
        // Worker Identity Card (Worker Name, Worker ID)
        item {
          Card(
            modifier = Modifier
              .fillMaxWidth()
              .testTag("profile_worker_card"),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = PureWhite),
            border = androidx.compose.foundation.BorderStroke(1.dp, IndustrialCardBorder),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
          ) {
            Column(
              modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
              horizontalAlignment = Alignment.CenterHorizontally
            ) {
              // Worker Avatar
              Box(
                modifier = Modifier
                  .size(90.dp)
                  .clip(CircleShape)
                  .border(3.dp, SafetyOrange, CircleShape)
              ) {
                Image(
                  painter = painterResource(id = R.drawable.img_worker_avatar),
                  contentDescription = "Worker Avatar",
                  modifier = Modifier.fillMaxSize(),
                  contentScale = ContentScale.Crop
                )
              }

              Spacer(modifier = Modifier.height(14.dp))

              // Worker Name
              Text(
                text = workerProfile.name,
                style = MaterialTheme.typography.headlineMedium.copy(
                  fontWeight = FontWeight.Bold,
                  color = TextNavyDark
                )
              )

              Spacer(modifier = Modifier.height(4.dp))

              // Worker ID Badge (Soft Blue container + Industrial Blue)
              Surface(
                shape = RoundedCornerShape(6.dp),
                color = SoftBlue,
                border = androidx.compose.foundation.BorderStroke(1.dp, SoftBlueBorder)
              ) {
                Row(
                  modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                  verticalAlignment = Alignment.CenterVertically,
                  horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                  Icon(
                    imageVector = Icons.Default.Badge,
                    contentDescription = null,
                    tint = IndustrialBlue,
                    modifier = Modifier.size(16.dp)
                  )
                  Text(
                    text = "${strings.workerIdLabel}: ${workerProfile.workerId}",
                    style = MaterialTheme.typography.labelMedium.copy(
                      color = IndustrialBlue,
                      fontWeight = FontWeight.Bold,
                      letterSpacing = 1.sp
                    )
                  )
                }
              }

              Spacer(modifier = Modifier.height(10.dp))

              // Operational Role / Clearance
              Text(
                text = workerProfile.role,
                style = MaterialTheme.typography.bodyMedium.copy(
                  color = TextSlateMedium
                )
              )
            }
          }
        }

        // Biometric Face Authentication Profile Card
        item {
          Card(
            modifier = Modifier
              .fillMaxWidth()
              .testTag("profile_biometric_face_card"),
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
                    text = "BIOMETRIC FACE AUTHENTICATION",
                    style = MaterialTheme.typography.titleMedium.copy(
                      fontWeight = FontWeight.Black,
                      color = TextNavyDark
                    )
                  )
                }

                Surface(
                  shape = RoundedCornerShape(6.dp),
                  color = SafetyGreen.copy(alpha = 0.15f)
                ) {
                  Text(
                    text = "ENROLLED",
                    style = MaterialTheme.typography.labelSmall.copy(
                      fontWeight = FontWeight.Bold,
                      color = SafetyGreen
                    ),
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                  )
                }
              }

              Surface(
                shape = RoundedCornerShape(10.dp),
                color = SoftSurface,
                modifier = Modifier.fillMaxWidth()
              ) {
                Row(
                  modifier = Modifier.padding(12.dp),
                  verticalAlignment = Alignment.CenterVertically,
                  horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                  Box(
                    modifier = Modifier
                      .size(52.dp)
                      .clip(CircleShape)
                      .border(2.dp, SafetyOrange, CircleShape)
                  ) {
                    Image(
                      painter = painterResource(id = R.drawable.img_worker_avatar),
                      contentDescription = "Enrolled Worker Face",
                      modifier = Modifier.fillMaxSize(),
                      contentScale = ContentScale.Crop
                    )
                  }

                  Column(modifier = Modifier.weight(1f)) {
                    Text(
                      text = "Biometric Profile: ${workerProfile.name}",
                      style = MaterialTheme.typography.bodyMedium.copy(
                        fontWeight = FontWeight.Bold,
                        color = TextNavyDark
                      )
                    )
                    Text(
                      text = "Operator ID: ${workerProfile.workerId} â€¢ Accuracy: 99.1%",
                      style = MaterialTheme.typography.bodySmall.copy(
                        color = TextSlateMedium
                      )
                    )
                  }
                }
              }

              Text(
                text = "When authenticating for training drills, the camera automatically scans and matches against this enrolled login face with zero delay.",
                style = MaterialTheme.typography.bodySmall.copy(
                  color = TextSlateMedium,
                  lineHeight = 18.sp
                )
              )

              IndustrialPrimaryButton(
                text = "TEST AUTOMATIC FACE SCAN",
                onClick = { showTestFaceScanDialog = true },
                icon = Icons.Default.Sensors,
                testTag = "profile_test_face_scan_button"
              )
            }
          }
        }

        // Training Progress Section
        item {
          Card(
            modifier = Modifier
              .fillMaxWidth()
              .testTag("profile_progress_card"),
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
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
              ) {
                Text(
                  text = strings.trainingProgressLabel,
                  style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.Bold,
                    color = TextNavyDark
                  )
                )
                Text(
                  text = "$progressPercentage%",
                  style = MaterialTheme.typography.titleLarge.copy(
                    fontWeight = FontWeight.Black,
                    color = if (progressPercentage >= 80) SafetyGreen else SafetyOrange
                  )
                )
              }

              Spacer(modifier = Modifier.height(10.dp))

              LinearProgressIndicator(
                progress = { progressFraction },
                modifier = Modifier
                  .fillMaxWidth()
                  .height(10.dp)
                  .clip(RoundedCornerShape(5.dp)),
                color = if (progressPercentage >= 80) SafetyGreen else SafetyOrange,
                trackColor = SoftBlue
              )

              Spacer(modifier = Modifier.height(12.dp))

              Text(
                text = "$passedCount of $totalCount Modules Certified ($progressPercentage%)",
                style = MaterialTheme.typography.bodyMedium.copy(
                  color = TextSlateMedium,
                  fontWeight = FontWeight.Medium
                )
              )
            }
          }
        }

        // Completed Modules Section
        item {
          Card(
            modifier = Modifier
              .fillMaxWidth()
              .testTag("profile_completed_modules_card"),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = PureWhite),
            border = androidx.compose.foundation.BorderStroke(1.dp, IndustrialCardBorder),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
          ) {
            Column(
              modifier = Modifier
                .fillMaxWidth()
                .padding(18.dp),
              verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
              Text(
                text = strings.completedModulesLabel,
                style = MaterialTheme.typography.titleMedium.copy(
                  fontWeight = FontWeight.Bold,
                  color = TextNavyDark
                )
              )

              val cert1 = certifications["fire_extinguisher"]
              CompletedModuleRow(
                title = strings.mod1Title,
                statusText = if (cert1?.isPassed == true) "Completed (Score: ${cert1.scorePercentage}%)" else "Pending Assessment",
                isCompleted = cert1?.isPassed == true
              )

              val cert2 = certifications["gas_leakage"]
              CompletedModuleRow(
                title = strings.mod2Title,
                statusText = if (cert2?.isPassed == true) "Completed (Score: ${cert2.scorePercentage}%)" else "Pending Assessment",
                isCompleted = cert2?.isPassed == true
              )

              val cert3 = certifications["confined_space"]
              CompletedModuleRow(
                title = strings.mod3Title,
                statusText = if (cert3?.isPassed == true) "Completed (Score: ${cert3.scorePercentage}%)" else if (cert3?.scorePercentage ?: 0 > 0) "Score: ${cert3?.scorePercentage}% (Retake)" else "Pending Assessment",
                isCompleted = cert3?.isPassed == true
              )

              val cert4 = certifications["ppe_emergency"]
              CompletedModuleRow(
                title = strings.mod4Title,
                statusText = if (cert4?.isPassed == true) "Completed (Score: ${cert4.scorePercentage}%)" else if (cert4?.scorePercentage ?: 0 > 0) "Score: ${cert4?.scorePercentage}% (Retake)" else "Pending Assessment",
                isCompleted = cert4?.isPassed == true
              )
            }
          }
        }

        // Certificates Section
        item {
          Card(
            modifier = Modifier
              .fillMaxWidth()
              .testTag("profile_certificates_card"),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = PureWhite),
            border = androidx.compose.foundation.BorderStroke(1.dp, IndustrialCardBorder),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
          ) {
            Column(
              modifier = Modifier
                .fillMaxWidth()
                .padding(18.dp),
              verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
              Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
              ) {
                Icon(
                  imageVector = Icons.Default.VerifiedUser,
                  contentDescription = null,
                  tint = IndustrialBlue,
                  modifier = Modifier.size(20.dp)
                )
                Text(
                  text = strings.certificatesLabel,
                  style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.Bold,
                    color = TextNavyDark
                  )
                )
              }

              // Certificate Item 1
              CertificateCard(
                title = strings.cert1Title,
                validity = strings.cert1Date,
                badge = strings.certStatusValid
              )

              // Certificate Item 2
              CertificateCard(
                title = strings.cert2Title,
                validity = strings.cert2Date,
                badge = strings.certStatusValid
              )
            }
          }
        }
      }
    }

    if (showTestFaceScanDialog) {
      AutoFaceScannerDialog(
        domainTitle = "Profile Biometric Self-Test",
        onFaceVerified = { showTestFaceScanDialog = false },
        onDismiss = { showTestFaceScanDialog = false }
      )
    }
  }
}

@Composable
fun CompletedModuleRow(
  title: String,
  statusText: String,
  isCompleted: Boolean
) {
  Row(
    modifier = Modifier
      .fillMaxWidth()
      .background(SoftSurface, RoundedCornerShape(10.dp))
      .border(1.dp, IndustrialCardBorder, RoundedCornerShape(10.dp))
      .padding(12.dp),
    verticalAlignment = Alignment.CenterVertically,
    horizontalArrangement = Arrangement.spacedBy(12.dp)
  ) {
    Icon(
      imageVector = if (isCompleted) Icons.Default.CheckCircle else Icons.Default.Pending,
      contentDescription = null,
      tint = if (isCompleted) IndustrialBlue else SafetyOrange,
      modifier = Modifier.size(22.dp)
    )
    Column(modifier = Modifier.weight(1f)) {
      Text(
        text = title,
        style = MaterialTheme.typography.bodyMedium.copy(
          fontWeight = FontWeight.Bold,
          color = TextNavyDark
        )
      )
      Text(
        text = statusText,
        style = MaterialTheme.typography.bodySmall.copy(
          color = if (isCompleted) IndustrialBlue else SafetyOrange,
          fontWeight = FontWeight.SemiBold
        )
      )
    }
  }
}

@Composable
fun CertificateCard(
  title: String,
  validity: String,
  badge: String
) {
  Surface(
    modifier = Modifier.fillMaxWidth(),
    shape = RoundedCornerShape(10.dp),
    color = SoftSurface,
    border = androidx.compose.foundation.BorderStroke(1.dp, IndustrialCardBorder)
  ) {
    Column(modifier = Modifier.padding(12.dp)) {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Text(
          text = title,
          style = MaterialTheme.typography.bodyMedium.copy(
            fontWeight = FontWeight.Bold,
            color = TextNavyDark
          ),
          modifier = Modifier.weight(1f)
        )
        Spacer(modifier = Modifier.width(8.dp))
        Surface(
          shape = RoundedCornerShape(4.dp),
          color = SoftBlue,
          border = androidx.compose.foundation.BorderStroke(1.dp, SoftBlueBorder)
        ) {
          Text(
            text = badge,
            style = MaterialTheme.typography.labelSmall.copy(
              color = IndustrialBlue,
              fontWeight = FontWeight.Bold,
              letterSpacing = 0.8.sp
            ),
            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
          )
        }
      }
      Spacer(modifier = Modifier.height(4.dp))
      Text(
        text = validity,
        style = MaterialTheme.typography.bodySmall.copy(
          color = TextSlateMedium
        )
      )
    }
  }
}
