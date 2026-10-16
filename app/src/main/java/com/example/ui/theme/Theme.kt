package com.example.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val IndustrialDarkColorScheme =
  darkColorScheme(
    primary = SafetyOrange,
    onPrimary = Color.White,
    primaryContainer = SafetyOrangeDark,
    onPrimaryContainer = Color.White,
    secondary = IndustrialBlue,
    onSecondary = Color.White,
    secondaryContainer = RoyalBlue,
    onSecondaryContainer = Color.White,
    tertiary = ElectricBlue,
    onTertiary = Color.White,
    background = CleanCanvas,
    onBackground = TextNavyDark,
    surface = PureWhite,
    onSurface = TextNavyDark,
    surfaceVariant = SoftSurface,
    onSurfaceVariant = TextSlateMedium,
    outline = CardBorderLight,
    error = SafetyRed,
    onError = Color.White
  )

private val IndustrialLightColorScheme =
  lightColorScheme(
    primary = SafetyOrange,
    onPrimary = Color.White,
    primaryContainer = SafetyOrangeSubtle,
    onPrimaryContainer = SafetyOrangeDark,
    secondary = IndustrialBlue,
    onSecondary = Color.White,
    secondaryContainer = SoftBlue,
    onSecondaryContainer = IndustrialBlue,
    tertiary = ElectricBlue,
    onTertiary = Color.White,
    background = CleanCanvas,
    onBackground = TextNavyDark,
    surface = PureWhite,
    onSurface = TextNavyDark,
    surfaceVariant = SoftSurface,
    onSurfaceVariant = TextSlateMedium,
    outline = IndustrialCardBorder,
    error = SafetyRed,
    onError = Color.White
  )

@Composable
fun MyApplicationTheme(
  darkTheme: Boolean = false, // White, Orange, and Blue primary theme
  content: @Composable () -> Unit,
) {
  val colorScheme = if (darkTheme) IndustrialDarkColorScheme else IndustrialLightColorScheme

  MaterialTheme(
    colorScheme = colorScheme,
    typography = Typography,
    content = content
  )
}

