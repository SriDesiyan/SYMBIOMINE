package com.example.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Face
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Login
import androidx.compose.material.icons.filled.Sensors
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Divider
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.R
import com.example.data.AppStrings
import com.example.data.FaceAuthRepository
import com.example.data.Language
import com.example.ui.components.AutoFaceScannerDialog
import com.example.ui.components.HazardStripeBar
import com.example.ui.components.IndustrialOutlineButton
import com.example.ui.components.IndustrialPrimaryButton
import com.example.ui.components.OfflineBadge
import com.example.ui.theme.CleanCanvas
import com.example.ui.theme.HazardAmber
import com.example.ui.theme.IndustrialBlue
import com.example.ui.theme.IndustrialCardBorder
import com.example.ui.theme.IndustrialDivider
import com.example.ui.theme.PureWhite
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

@Composable
fun LoginScreen(
  strings: AppStrings,
  currentLanguage: Language,
  onLanguageChange: (Language) -> Unit,
  onLoginSuccess: () -> Unit,
  onSkip: () -> Unit
) {
  var email by remember { mutableStateOf("rajesh.murmu@mine.corp") }
  var password by remember { mutableStateOf("••••••••") }
  var passwordVisible by remember { mutableStateOf(false) }
  var languageMenuExpanded by remember { mutableStateOf(false) }
  var showFaceLoginScanner by remember { mutableStateOf(false) }
  val focusManager = LocalFocusManager.current
  val scrollState = rememberScrollState()

  Box(
    modifier = Modifier
      .fillMaxSize()
      .background(CleanCanvas)
  ) {
    Column(
      modifier = Modifier
        .fillMaxSize()
        .verticalScroll(scrollState)
        .statusBarsPadding()
        .imePadding()
        .padding(bottom = 32.dp),
      horizontalAlignment = Alignment.CenterHorizontally
    ) {
      // Top Language Selector & Offline indicator row
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .padding(horizontal = 20.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        OfflineBadge(text = strings.offlineActiveBadge)

        // Language Quick Switcher
        Box {
          Surface(
            modifier = Modifier
              .clip(RoundedCornerShape(8.dp))
              .clickable { languageMenuExpanded = true }
              .border(1.dp, IndustrialCardBorder, RoundedCornerShape(8.dp))
              .testTag("login_language_selector"),
            color = PureWhite,
            shadowElevation = 1.dp
          ) {
            Row(
              modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
              Icon(
                imageVector = Icons.Default.Language,
                contentDescription = "Change Language",
                tint = IndustrialBlue,
                modifier = Modifier.size(16.dp)
              )
              Text(
                text = currentLanguage.displayName,
                color = TextNavyDark,
                style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
              )
            }
          }

          DropdownMenu(
            expanded = languageMenuExpanded,
            onDismissRequest = { languageMenuExpanded = false },
            modifier = Modifier.background(PureWhite)
          ) {
            Language.entries.forEach { lang ->
              DropdownMenuItem(
                text = {
                  Text(
                    text = "${lang.displayName} (${lang.nativeName})",
                    color = if (lang == currentLanguage) SafetyOrange else TextNavyDark,
                    fontWeight = if (lang == currentLanguage) FontWeight.Bold else FontWeight.Normal
                  )
                },
                onClick = {
                  onLanguageChange(lang)
                  languageMenuExpanded = false
                }
              )
            }
          }
        }
      }

      Spacer(modifier = Modifier.height(8.dp))

      // Visual Branding & App Title
      Box(
        modifier = Modifier
          .fillMaxWidth()
          .padding(horizontal = 20.dp),
        contentAlignment = Alignment.Center
      ) {
        Column(
          horizontalAlignment = Alignment.CenterHorizontally,
          modifier = Modifier.fillMaxWidth()
        ) {
          // App Logo / Hardhat Emblem with AR Badge
          Surface(
            modifier = Modifier
              .size(82.dp)
              .clip(RoundedCornerShape(20.dp))
              .border(2.5.dp, IndustrialBlue, RoundedCornerShape(20.dp)),
            color = PureWhite,
            shadowElevation = 6.dp
          ) {
            Box(contentAlignment = Alignment.Center) {
              Image(
                painter = painterResource(id = R.drawable.img_app_icon),
                contentDescription = "SYMBIOMINE AR Logo",
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
              )
            }
          }

          Spacer(modifier = Modifier.height(16.dp))

          // Brand Name with AR tag (White, Orange, and Blue style)
          Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
          ) {
            Text(
              text = "SYMBIOMINE",
              style = MaterialTheme.typography.headlineLarge.copy(
                fontWeight = FontWeight.Black,
                letterSpacing = 1.2.sp,
                color = IndustrialBlue
              )
            )
            Spacer(modifier = Modifier.width(6.dp))
            Surface(
              shape = RoundedCornerShape(6.dp),
              color = SafetyOrange,
              modifier = Modifier.padding(bottom = 2.dp)
            ) {
              Text(
                text = "AR",
                color = Color.White,
                fontWeight = FontWeight.Black,
                fontSize = 16.sp,
                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
              )
            }
          }

          Spacer(modifier = Modifier.height(4.dp))

          // Subtitle: Mining Safety Training in Safety Orange
          Text(
            text = strings.subtitle,
            style = MaterialTheme.typography.titleMedium.copy(
              color = SafetyOrangeDark,
              fontWeight = FontWeight.Bold,
              letterSpacing = 0.5.sp
            ),
            textAlign = TextAlign.Center
          )

          Spacer(modifier = Modifier.height(6.dp))

          Text(
            text = "Industrial & Mining Occupational Safety System",
            style = MaterialTheme.typography.bodySmall.copy(
              color = TextSlateMedium
            ),
            textAlign = TextAlign.Center
          )
        }
      }

      Spacer(modifier = Modifier.height(20.dp))

      // Industrial Hazard Accent Stripe (Orange & Blue)
      HazardStripeBar(
        modifier = Modifier.padding(horizontal = 20.dp),
        stripeHeight = 5.dp
      )

      Spacer(modifier = Modifier.height(24.dp))

      // Login Card Container (Crisp White Card with subtle border & shadow)
      Surface(
        modifier = Modifier
          .fillMaxWidth()
          .padding(horizontal = 20.dp)
          .border(1.dp, IndustrialCardBorder, RoundedCornerShape(16.dp)),
        shape = RoundedCornerShape(16.dp),
        color = PureWhite,
        shadowElevation = 4.dp
      ) {
        Column(
          modifier = Modifier
            .fillMaxWidth()
            .padding(22.dp),
          horizontalAlignment = Alignment.CenterHorizontally
        ) {
          Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
          ) {
            Icon(
              imageVector = Icons.Default.Shield,
              contentDescription = null,
              tint = IndustrialBlue,
              modifier = Modifier.size(22.dp)
            )
            Text(
              text = strings.loginTitle,
              style = MaterialTheme.typography.titleMedium.copy(
                fontWeight = FontWeight.Bold,
                color = TextNavyDark
              )
            )
          }

          Spacer(modifier = Modifier.height(16.dp))

          // AUTOMATIC FACE SCAN BIOMETRIC LOGIN CARD
          Surface(
            shape = RoundedCornerShape(12.dp),
            color = SoftBlue,
            border = androidx.compose.foundation.BorderStroke(1.5.dp, SoftBlueBorder),
            modifier = Modifier.fillMaxWidth()
          ) {
            Column(
              modifier = Modifier.padding(14.dp),
              verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
              Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
              ) {
                Box(
                  modifier = Modifier
                    .size(46.dp)
                    .clip(CircleShape)
                    .border(2.dp, SafetyOrange, CircleShape)
                ) {
                  Image(
                    painter = painterResource(id = R.drawable.img_worker_avatar),
                    contentDescription = "Registered Worker Face",
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
                      text = "FACE BIOMETRIC READY",
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
                        text = "ENROLLED",
                        color = SafetyGreen,
                        fontWeight = FontWeight.Bold,
                        fontSize = 9.sp,
                        modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
                      )
                    }
                  }
                  Text(
                    text = "Rajesh Kumar Murmu (MIN-84920)",
                    style = MaterialTheme.typography.bodyMedium.copy(
                      fontWeight = FontWeight.Bold,
                      color = TextNavyDark
                    )
                  )
                }
              }

              // Automatic Face Login Button
              IndustrialPrimaryButton(
                text = strings.faceLoginButton,
                onClick = { showFaceLoginScanner = true },
                icon = Icons.Default.Sensors,
                testTag = "login_face_biometric_button"
              )
            }
          }

          Spacer(modifier = Modifier.height(18.dp))

          // "OR USE OPERATOR CREDENTIALS" divider
          Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
          ) {
            Divider(modifier = Modifier.weight(1f), color = IndustrialDivider, thickness = 1.dp)
            Text(
              text = "OR ENTER PIN / PASSWORD",
              style = MaterialTheme.typography.labelSmall.copy(
                fontWeight = FontWeight.Bold,
                color = TextSlateMedium,
                letterSpacing = 0.8.sp
              ),
              modifier = Modifier.padding(horizontal = 8.dp)
            )
            Divider(modifier = Modifier.weight(1f), color = IndustrialDivider, thickness = 1.dp)
          }

          Spacer(modifier = Modifier.height(18.dp))

          // Email Input Field
          Text(
            text = strings.emailLabel,
            style = MaterialTheme.typography.labelMedium.copy(
              color = TextNavyDark,
              fontWeight = FontWeight.Bold
            ),
            modifier = Modifier.fillMaxWidth()
          )
          Spacer(modifier = Modifier.height(6.dp))
          OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            modifier = Modifier
              .fillMaxWidth()
              .testTag("login_email_input"),
            placeholder = {
              Text(
                text = strings.emailPlaceholder,
                color = TextSlateMuted
              )
            },
            leadingIcon = {
              Icon(
                imageVector = Icons.Default.Email,
                contentDescription = null,
                tint = IndustrialBlue
              )
            },
            singleLine = true,
            keyboardOptions = KeyboardOptions(
              keyboardType = KeyboardType.Email,
              imeAction = ImeAction.Next
            ),
            colors = OutlinedTextFieldDefaults.colors(
              focusedBorderColor = IndustrialBlue,
              unfocusedBorderColor = IndustrialCardBorder,
              focusedContainerColor = SoftSurface,
              unfocusedContainerColor = SoftSurface,
              focusedTextColor = TextNavyDark,
              unfocusedTextColor = TextNavyDark
            ),
            shape = RoundedCornerShape(10.dp)
          )

          Spacer(modifier = Modifier.height(16.dp))

          // Password Input Field
          Text(
            text = strings.passwordLabel,
            style = MaterialTheme.typography.labelMedium.copy(
              color = TextNavyDark,
              fontWeight = FontWeight.Bold
            ),
            modifier = Modifier.fillMaxWidth()
          )
          Spacer(modifier = Modifier.height(6.dp))
          OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            modifier = Modifier
              .fillMaxWidth()
              .testTag("login_password_input"),
            placeholder = {
              Text(
                text = strings.passwordPlaceholder,
                color = TextSlateMuted
              )
            },
            leadingIcon = {
              Icon(
                imageVector = Icons.Default.Lock,
                contentDescription = null,
                tint = IndustrialBlue
              )
            },
            trailingIcon = {
              IconButton(onClick = { passwordVisible = !passwordVisible }) {
                Icon(
                  imageVector = if (passwordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                  contentDescription = if (passwordVisible) "Hide password" else "Show password",
                  tint = TextSlateMedium
                )
              }
            },
            visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
            singleLine = true,
            keyboardOptions = KeyboardOptions(
              keyboardType = KeyboardType.Password,
              imeAction = ImeAction.Done
            ),
            keyboardActions = KeyboardActions(
              onDone = {
                focusManager.clearFocus()
                FaceAuthRepository.enrollFaceAtLogin(workerName = "Rajesh Kumar Murmu", workerId = "MIN-84920")
                onLoginSuccess()
              }
            ),
            colors = OutlinedTextFieldDefaults.colors(
              focusedBorderColor = IndustrialBlue,
              unfocusedBorderColor = IndustrialCardBorder,
              focusedContainerColor = SoftSurface,
              unfocusedContainerColor = SoftSurface,
              focusedTextColor = TextNavyDark,
              unfocusedTextColor = TextNavyDark
            ),
            shape = RoundedCornerShape(10.dp)
          )

          Spacer(modifier = Modifier.height(24.dp))

          // Login Button (Safety Orange with White text)
          IndustrialPrimaryButton(
            text = strings.loginButton,
            onClick = {
              FaceAuthRepository.enrollFaceAtLogin(workerName = "Rajesh Kumar Murmu", workerId = "MIN-84920")
              onLoginSuccess()
            },
            icon = Icons.Default.Login,
            testTag = "login_submit_button"
          )

          Spacer(modifier = Modifier.height(20.dp))

          // "OR" Divider
          Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
          ) {
            Divider(
              modifier = Modifier.weight(1f),
              color = IndustrialDivider,
              thickness = 1.dp
            )
            Surface(
              shape = RoundedCornerShape(12.dp),
              color = SoftBlue,
              border = androidx.compose.foundation.BorderStroke(1.dp, SoftBlueBorder),
              modifier = Modifier.padding(horizontal = 12.dp)
            ) {
              Text(
                text = strings.orDivider,
                style = MaterialTheme.typography.labelSmall.copy(
                  fontWeight = FontWeight.Bold,
                  letterSpacing = 1.sp
                ),
                color = IndustrialBlue,
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp)
              )
            }
            Divider(
              modifier = Modifier.weight(1f),
              color = IndustrialDivider,
              thickness = 1.dp
            )
          }

          Spacer(modifier = Modifier.height(20.dp))

          // "Continue with Google" button (Crisp White + Industrial Blue)
          IndustrialOutlineButton(
            text = strings.continueWithGoogle,
            onClick = {
              FaceAuthRepository.enrollFaceAtLogin(workerName = "Rajesh Kumar Murmu", workerId = "MIN-84920")
              onLoginSuccess()
            },
            icon = Icons.Default.Shield,
            testTag = "login_google_button"
          )

          Spacer(modifier = Modifier.height(16.dp))

          // "Skip" option below the Google login (in Industrial Blue)
          TextButton(
            onClick = {
              FaceAuthRepository.enrollFaceAtLogin(workerName = "Rajesh Kumar Murmu", workerId = "MIN-84920")
              onSkip()
            },
            modifier = Modifier
              .fillMaxWidth()
              .height(48.dp)
              .testTag("login_skip_button")
          ) {
            Text(
              text = strings.skipOffline,
              style = MaterialTheme.typography.bodyMedium.copy(
                fontWeight = FontWeight.Bold,
                color = IndustrialBlue
              )
            )
          }
        }
      }

      Spacer(modifier = Modifier.height(20.dp))

      // Industrial Safety Compliance Notice at bottom
      Text(
        text = "ISO 45001 • DGMS Mining Safety Standard Compliant",
        style = MaterialTheme.typography.labelSmall.copy(
          color = TextSlateMuted,
          letterSpacing = 0.5.sp
        ),
        textAlign = TextAlign.Center
      )
    }

    // Auto Face Scanner Dialog for Login
    if (showFaceLoginScanner) {
      AutoFaceScannerDialog(
        domainTitle = "Worker Portal Face Login",
        onFaceVerified = {
          showFaceLoginScanner = false
          FaceAuthRepository.enrollFaceAtLogin(workerName = "Rajesh Kumar Murmu", workerId = "MIN-84920")
          onLoginSuccess()
        },
        onDismiss = { showFaceLoginScanner = false }
      )
    }
  }
}
