package com.example.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.WifiOff
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.HazardAmber
import com.example.ui.theme.IndustrialBlue
import com.example.ui.theme.IndustrialCardBorder
import com.example.ui.theme.PureWhite
import com.example.ui.theme.SafetyGreen
import com.example.ui.theme.SafetyOrange
import com.example.ui.theme.SoftBlue
import com.example.ui.theme.SoftBlueBorder

/**
 * Industrial hazard stripe accent bar for mining safety visual identity.
 * Uses alternating Safety Orange and Industrial Blue stripes.
 */
@Composable
fun HazardStripeBar(
  modifier: Modifier = Modifier,
  stripeHeight: Dp = 6.dp,
  stripeColor: Color = SafetyOrange,
  backgroundColor: Color = IndustrialBlue
) {
  Canvas(
    modifier = modifier
      .fillMaxWidth()
      .height(stripeHeight)
  ) {
    drawRect(backgroundColor)
    val width = size.width
    val height = size.height
    val stripeWidth = 14f
    val spacing = 28f
    var startX = -height
    while (startX < width + height) {
      drawLine(
        color = stripeColor,
        start = Offset(startX, height),
        end = Offset(startX + height, 0f),
        strokeWidth = stripeWidth
      )
      startX += spacing
    }
  }
}

/**
 * Offline Mode Indicator Pill Badge.
 */
@Composable
fun OfflineBadge(
  text: String,
  modifier: Modifier = Modifier
) {
  Row(
    modifier = modifier
      .background(
        color = SoftBlue,
        shape = RoundedCornerShape(20.dp)
      )
      .border(
        width = 1.dp,
        color = SoftBlueBorder,
        shape = RoundedCornerShape(20.dp)
      )
      .padding(horizontal = 10.dp, vertical = 4.dp),
    verticalAlignment = Alignment.CenterVertically,
    horizontalArrangement = Arrangement.spacedBy(6.dp)
  ) {
    Icon(
      imageVector = Icons.Default.WifiOff,
      contentDescription = null,
      tint = IndustrialBlue,
      modifier = Modifier.size(14.dp)
    )
    Text(
      text = text,
      color = IndustrialBlue,
      style = MaterialTheme.typography.labelMedium.copy(
        fontWeight = FontWeight.Bold,
        letterSpacing = 0.8.sp
      )
    )
  }
}

/**
 * Large, touch-friendly primary action button for mining workers.
 */
@Composable
fun IndustrialPrimaryButton(
  text: String,
  onClick: () -> Unit,
  modifier: Modifier = Modifier,
  icon: ImageVector? = null,
  testTag: String = "primary_button"
) {
  Button(
    onClick = onClick,
    modifier = modifier
      .fillMaxWidth()
      .height(56.dp)
      .testTag(testTag),
    shape = RoundedCornerShape(10.dp),
    colors = ButtonDefaults.buttonColors(
      containerColor = SafetyOrange,
      contentColor = Color.White
    ),
    elevation = ButtonDefaults.buttonElevation(defaultElevation = 2.dp)
  ) {
    Row(
      verticalAlignment = Alignment.CenterVertically,
      horizontalArrangement = Arrangement.Center
    ) {
      if (icon != null) {
        Icon(
          imageVector = icon,
          contentDescription = null,
          tint = Color.White,
          modifier = Modifier
            .size(22.dp)
            .padding(end = 6.dp)
        )
      }
      Text(
        text = text,
        style = MaterialTheme.typography.labelLarge.copy(
          fontSize = 16.sp,
          fontWeight = FontWeight.Black,
          letterSpacing = 0.8.sp,
          color = Color.White
        )
      )
    }
  }
}

/**
 * Large, touch-friendly secondary outline button in Industrial Blue & White.
 */
@Composable
fun IndustrialOutlineButton(
  text: String,
  onClick: () -> Unit,
  modifier: Modifier = Modifier,
  icon: ImageVector? = null,
  testTag: String = "outline_button"
) {
  OutlinedButton(
    onClick = onClick,
    modifier = modifier
      .fillMaxWidth()
      .height(54.dp)
      .testTag(testTag),
    shape = RoundedCornerShape(10.dp),
    colors = ButtonDefaults.outlinedButtonColors(
      containerColor = PureWhite,
      contentColor = IndustrialBlue
    ),
    border = androidx.compose.foundation.BorderStroke(1.5.dp, IndustrialBlue)
  ) {
    Row(
      verticalAlignment = Alignment.CenterVertically,
      horizontalArrangement = Arrangement.Center
    ) {
      if (icon != null) {
        Icon(
          imageVector = icon,
          contentDescription = null,
          modifier = Modifier
            .size(20.dp)
            .padding(end = 6.dp),
          tint = IndustrialBlue
        )
      }
      Text(
        text = text,
        style = MaterialTheme.typography.labelLarge.copy(
          fontSize = 15.sp,
          fontWeight = FontWeight.Bold,
          color = IndustrialBlue
        )
      )
    }
  }
}
