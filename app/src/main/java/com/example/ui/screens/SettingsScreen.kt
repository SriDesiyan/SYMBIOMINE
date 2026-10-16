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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Storage
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material.icons.filled.Vibration
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material.icons.filled.WifiOff
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.RadioButton
import androidx.compose.material3.RadioButtonDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.AppStrings
import com.example.data.Language
import com.example.ui.components.HazardStripeBar
import com.example.ui.theme.CleanCanvas
import com.example.ui.theme.HazardAmber
import com.example.ui.theme.IndustrialBlue
import com.example.ui.theme.IndustrialCardBorder
import com.example.ui.theme.IndustrialDivider
import com.example.ui.theme.PureWhite
import com.example.ui.theme.SafetyGreen
import com.example.ui.theme.SafetyOrange
import com.example.ui.theme.SafetyOrangeDark
import com.example.ui.theme.SoftBlue
import com.example.ui.theme.SoftBlueBorder
import com.example.ui.theme.SoftSurface
import com.example.ui.theme.TextNavyDark
import com.example.ui.theme.TextSlateMedium
import com.example.ui.theme.TextSlateMuted

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
  strings: AppStrings,
  currentLanguage: Language,
  audioNarration: Boolean,
  hapticFeedback: Boolean,
  notifications: Boolean,
  onLanguageChange: (Language) -> Unit,
  onAudioNarrationChange: (Boolean) -> Unit,
  onHapticFeedbackChange: (Boolean) -> Unit,
  onNotificationsChange: (Boolean) -> Unit,
  onBack: () -> Unit
) {
  Box(
    modifier = Modifier
      .fillMaxSize()
      .background(CleanCanvas)
  ) {
    Column(modifier = Modifier.fillMaxSize()) {
      // Top Bar (Crisp White with Industrial Blue title & icon)
      TopAppBar(
        title = {
          Text(
            text = strings.settingsTitle,
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
              .testTag("settings_back_button")
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
        // Section: Language Selection
        item {
          Card(
            modifier = Modifier
              .fillMaxWidth()
              .testTag("settings_language_section"),
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
                horizontalArrangement = Arrangement.spacedBy(8.dp)
              ) {
                Icon(
                  imageVector = Icons.Default.Language,
                  contentDescription = null,
                  tint = IndustrialBlue,
                  modifier = Modifier.size(22.dp)
                )
                Text(
                  text = strings.languageSectionTitle,
                  style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.Bold,
                    color = TextNavyDark
                  )
                )
              }

              Spacer(modifier = Modifier.height(14.dp))

              // Exactly Three Language Options: English, Hindi, Santali (Ol Chiki)
              LanguageOptionItem(
                title = "English",
                subtitle = "Standard Industrial Mining Terminology",
                language = Language.ENGLISH,
                isSelected = currentLanguage == Language.ENGLISH,
                testTag = "lang_english",
                onSelect = { onLanguageChange(Language.ENGLISH) }
              )

              Spacer(modifier = Modifier.height(10.dp))

              LanguageOptionItem(
                title = "Hindi (हिंदी)",
                subtitle = "राष्ट्रीय खनन सुरक्षा दिशानिर्देश",
                language = Language.HINDI,
                isSelected = currentLanguage == Language.HINDI,
                testTag = "lang_hindi",
                onSelect = { onLanguageChange(Language.HINDI) }
              )

              Spacer(modifier = Modifier.height(10.dp))

              LanguageOptionItem(
                title = "Santali (ᱥᱟᱱᱛᱟᱲᱤ)",
                subtitle = "ᱚᱞ ᱪᱤᱠᱤ ᱞᱤᱯᱤ / ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ",
                language = Language.SANTALI,
                isSelected = currentLanguage == Language.SANTALI,
                testTag = "lang_santali",
                onSelect = { onLanguageChange(Language.SANTALI) }
              )
            }
          }
        }

        // Section: Additional Settings (Audio Narration, Haptic Feedback, Notifications, Offline Mode)
        item {
          Card(
            modifier = Modifier
              .fillMaxWidth()
              .testTag("settings_additional_section"),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = PureWhite),
            border = androidx.compose.foundation.BorderStroke(1.dp, IndustrialCardBorder),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
          ) {
            Column(
              modifier = Modifier
                .fillMaxWidth()
                .padding(18.dp),
              verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
              Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
              ) {
                Icon(
                  imageVector = Icons.Default.Tune,
                  contentDescription = null,
                  tint = IndustrialBlue,
                  modifier = Modifier.size(22.dp)
                )
                Text(
                  text = strings.additionalSettingsTitle,
                  style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.Bold,
                    color = TextNavyDark
                  )
                )
              }

              // Audio Narration Switch
              SettingToggleRow(
                title = strings.audioNarrationTitle,
                description = strings.audioNarrationDesc,
                icon = Icons.Default.VolumeUp,
                checked = audioNarration,
                onCheckedChange = onAudioNarrationChange,
                testTag = "switch_audio_narration"
              )

              // Haptic Feedback Switch
              SettingToggleRow(
                title = strings.hapticFeedbackTitle,
                description = strings.hapticFeedbackDesc,
                icon = Icons.Default.Vibration,
                checked = hapticFeedback,
                onCheckedChange = onHapticFeedbackChange,
                testTag = "switch_haptic_feedback"
              )

              // Notifications Switch
              SettingToggleRow(
                title = strings.notificationsTitle,
                description = strings.notificationsDesc,
                icon = Icons.Default.Notifications,
                checked = notifications,
                onCheckedChange = onNotificationsChange,
                testTag = "switch_notifications"
              )

              // Offline Mode (Fixed Enabled)
              Surface(
                modifier = Modifier
                  .fillMaxWidth()
                  .testTag("offline_mode_indicator"),
                shape = RoundedCornerShape(12.dp),
                color = SoftBlue,
                border = androidx.compose.foundation.BorderStroke(1.dp, SoftBlueBorder)
              ) {
                Row(
                  modifier = Modifier.padding(14.dp),
                  verticalAlignment = Alignment.CenterVertically,
                  horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                  Icon(
                    imageVector = Icons.Default.WifiOff,
                    contentDescription = null,
                    tint = IndustrialBlue,
                    modifier = Modifier.size(24.dp)
                  )
                  Column(modifier = Modifier.weight(1f)) {
                    Row(
                      verticalAlignment = Alignment.CenterVertically,
                      horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                      Text(
                        text = strings.offlineModeTitle,
                        style = MaterialTheme.typography.bodyLarge.copy(
                          fontWeight = FontWeight.Bold,
                          color = TextNavyDark
                        )
                      )
                      Surface(
                        shape = RoundedCornerShape(4.dp),
                        color = PureWhite,
                        border = androidx.compose.foundation.BorderStroke(1.dp, SoftBlueBorder)
                      ) {
                        Text(
                          text = strings.offlineModeBadge,
                          style = MaterialTheme.typography.labelSmall.copy(
                            color = IndustrialBlue,
                            fontWeight = FontWeight.Black,
                            letterSpacing = 0.8.sp
                          ),
                          modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                      }
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                      text = strings.offlineModeDesc,
                      style = MaterialTheme.typography.bodySmall.copy(
                        color = TextSlateMedium
                      )
                    )
                  }
                }
              }
            }
          }
        }

        // Section: Industrial Hardware & Storage Diagnostics
        item {
          Surface(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            color = PureWhite,
            border = androidx.compose.foundation.BorderStroke(1.dp, IndustrialCardBorder),
            shadowElevation = 1.dp
          ) {
            Row(
              modifier = Modifier.padding(14.dp),
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
              Icon(
                imageVector = Icons.Default.Storage,
                contentDescription = null,
                tint = IndustrialBlue,
                modifier = Modifier.size(22.dp)
              )
              Column {
                Text(
                  text = "Device Storage & AR Diagnostics",
                  style = MaterialTheme.typography.bodyMedium.copy(
                    fontWeight = FontWeight.Bold,
                    color = TextNavyDark
                  )
                )
                Text(
                  text = "AR Cache: 2.4 GB offline assets • Engine v1.45 Ready",
                  style = MaterialTheme.typography.bodySmall.copy(
                    color = TextSlateMedium
                  )
                )
              }
            }
          }
        }
      }
    }
  }
}

@Composable
fun LanguageOptionItem(
  title: String,
  subtitle: String,
  language: Language,
  isSelected: Boolean,
  testTag: String,
  onSelect: () -> Unit
) {
  Surface(
    modifier = Modifier
      .fillMaxWidth()
      .testTag(testTag)
      .clickable { onSelect() },
    shape = RoundedCornerShape(10.dp),
    color = if (isSelected) SoftBlue else SoftSurface,
    border = androidx.compose.foundation.BorderStroke(
      1.5.dp,
      if (isSelected) IndustrialBlue else IndustrialCardBorder
    )
  ) {
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(12.dp),
      verticalAlignment = Alignment.CenterVertically,
      horizontalArrangement = Arrangement.SpaceBetween
    ) {
      Column(modifier = Modifier.weight(1f)) {
        Text(
          text = title,
          style = MaterialTheme.typography.bodyLarge.copy(
            fontWeight = FontWeight.Bold,
            color = if (isSelected) IndustrialBlue else TextNavyDark
          )
        )
        Text(
          text = subtitle,
          style = MaterialTheme.typography.bodySmall.copy(
            color = TextSlateMedium
          )
        )
      }
      RadioButton(
        selected = isSelected,
        onClick = onSelect,
        colors = RadioButtonDefaults.colors(
          selectedColor = IndustrialBlue,
          unselectedColor = IndustrialCardBorder
        )
      )
    }
  }
}

@Composable
fun SettingToggleRow(
  title: String,
  description: String,
  icon: androidx.compose.ui.graphics.vector.ImageVector,
  checked: Boolean,
  onCheckedChange: (Boolean) -> Unit,
  testTag: String
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
      imageVector = icon,
      contentDescription = null,
      tint = if (checked) SafetyOrange else TextSlateMedium,
      modifier = Modifier.size(24.dp)
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
        text = description,
        style = MaterialTheme.typography.bodySmall.copy(
          color = TextSlateMedium
        )
      )
    }
    Switch(
      checked = checked,
      onCheckedChange = onCheckedChange,
      modifier = Modifier.testTag(testTag),
      colors = SwitchDefaults.colors(
        checkedThumbColor = PureWhite,
        checkedTrackColor = SafetyOrange,
        uncheckedThumbColor = PureWhite,
        uncheckedTrackColor = IndustrialCardBorder
      )
    )
  }
}
