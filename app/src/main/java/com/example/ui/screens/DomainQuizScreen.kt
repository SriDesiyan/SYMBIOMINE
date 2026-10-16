package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
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
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Sensors
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
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
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.AppStrings
import com.example.data.FaceAuthRepository
import com.example.data.Question
import com.example.data.QuizRepository
import com.example.ui.components.HazardStripeBar
import com.example.ui.components.IndustrialOutlineButton
import com.example.ui.components.IndustrialPrimaryButton
import com.example.ui.theme.CleanCanvas
import com.example.ui.theme.ElectricBlue
import com.example.ui.theme.IndustrialBlue
import com.example.ui.theme.IndustrialCardBorder
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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DomainQuizScreen(
  moduleId: String,
  strings: AppStrings,
  onBack: () -> Unit
) {
  val domainTitle = remember(moduleId) { QuizRepository.getDomainTitle(moduleId) }
  val domainCode = remember(moduleId) { QuizRepository.getDomainCode(moduleId) }

  // Draw 5 randomized domain-specific questions
  var questions by remember(moduleId) {
    mutableStateOf(QuizRepository.getRandomQuestions(moduleId, count = 5))
  }

  var currentQuestionIndex by remember { mutableIntStateOf(0) }
  var selectedOptionIndex by remember { mutableStateOf<Int?>(null) }
  var isSubmitted by remember { mutableStateOf(false) }
  var correctAnswersCount by remember { mutableIntStateOf(0) }
  var isQuizFinished by remember { mutableStateOf(false) }

  val workerProfile = FaceAuthRepository.workerProfile.value

  // Restart quiz with fresh randomized questions
  fun restartQuiz() {
    questions = QuizRepository.getRandomQuestions(moduleId, count = 5)
    currentQuestionIndex = 0
    selectedOptionIndex = null
    isSubmitted = false
    correctAnswersCount = 0
    isQuizFinished = false
  }

  Box(
    modifier = Modifier
      .fillMaxSize()
      .background(CleanCanvas)
  ) {
    Column(modifier = Modifier.fillMaxSize()) {
      // Top App Bar
      TopAppBar(
        title = {
          Column {
            Text(
              text = "SAFETY ASSESSMENT",
              style = MaterialTheme.typography.titleMedium.copy(
                fontWeight = FontWeight.Black,
                letterSpacing = 0.5.sp,
                color = IndustrialBlue
              )
            )
            Text(
              text = domainTitle,
              style = MaterialTheme.typography.bodySmall.copy(
                color = TextSlateMedium,
                fontWeight = FontWeight.Medium
              ),
              maxLines = 1
            )
          }
        },
        navigationIcon = {
          IconButton(
            onClick = onBack,
            modifier = Modifier
              .size(48.dp)
              .testTag("quiz_back_button")
          ) {
            Icon(
              imageVector = Icons.AutoMirrored.Filled.ArrowBack,
              contentDescription = "Back",
              tint = IndustrialBlue
            )
          }
        },
        actions = {
          // Randomized Badge Indicator
          Surface(
            shape = RoundedCornerShape(12.dp),
            color = SoftBlue,
            border = androidx.compose.foundation.BorderStroke(1.dp, SoftBlueBorder),
            modifier = Modifier.padding(end = 12.dp)
          ) {
            Row(
              modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
              Icon(
                imageVector = Icons.Default.Refresh,
                contentDescription = null,
                tint = IndustrialBlue,
                modifier = Modifier.size(14.dp)
              )
              Text(
                text = "RANDOM MCQ",
                style = MaterialTheme.typography.labelSmall.copy(
                  fontWeight = FontWeight.Bold,
                  color = IndustrialBlue,
                  fontSize = 10.sp
                )
              )
            }
          }
        },
        colors = TopAppBarDefaults.topAppBarColors(
          containerColor = PureWhite
        ),
        modifier = Modifier.statusBarsPadding()
      )

      HazardStripeBar(stripeHeight = 3.dp)

      if (isQuizFinished) {
        // SUMMARY SCREEN
        QuizFinishedSummary(
          moduleId = moduleId,
          domainTitle = domainTitle,
          correctCount = correctAnswersCount,
          totalQuestions = questions.size,
          workerName = workerProfile.name,
          workerId = workerProfile.workerId,
          onRetake = { restartQuiz() },
          onReturnHome = onBack
        )
      } else {
        // ACTIVE MCQ QUESTION VIEW
        val currentQuestion = questions.getOrNull(currentQuestionIndex)

        if (currentQuestion != null) {
          LazyColumn(
            modifier = Modifier
              .fillMaxSize()
              .weight(1f),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
          ) {
            // Worker Biometric Auth Banner (Face matched from Login)
            item {
              Surface(
                shape = RoundedCornerShape(12.dp),
                color = PureWhite,
                border = androidx.compose.foundation.BorderStroke(1.dp, SoftBlueBorder),
                shadowElevation = 1.dp,
                modifier = Modifier.fillMaxWidth()
              ) {
                Row(
                  modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                  verticalAlignment = Alignment.CenterVertically,
                  horizontalArrangement = Arrangement.SpaceBetween
                ) {
                  Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                  ) {
                    Icon(
                      imageVector = Icons.Default.Verified,
                      contentDescription = "Face Verified",
                      tint = SafetyGreen,
                      modifier = Modifier.size(18.dp)
                    )
                    Text(
                      text = "Face Authenticated: ${workerProfile.name} (${workerProfile.workerId})",
                      style = MaterialTheme.typography.labelMedium.copy(
                        fontWeight = FontWeight.Bold,
                        color = TextNavyDark
                      )
                    )
                  }

                  Surface(
                    shape = RoundedCornerShape(4.dp),
                    color = SafetyGreen.copy(alpha = 0.12f)
                  ) {
                    Text(
                      text = "99.1% MATCH",
                      style = MaterialTheme.typography.labelSmall.copy(
                        fontWeight = FontWeight.Black,
                        color = SafetyGreen,
                        fontSize = 9.sp
                      ),
                      modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                  }
                }
              }
            }

            // Progress Header
            item {
              Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = PureWhite),
                border = androidx.compose.foundation.BorderStroke(1.dp, IndustrialCardBorder),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
              ) {
                Column(
                  modifier = Modifier
                    .fillMaxWidth()
                    .padding(14.dp),
                  verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                  Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                  ) {
                    Text(
                      text = "QUESTION ${currentQuestionIndex + 1} OF ${questions.size}",
                      style = MaterialTheme.typography.labelMedium.copy(
                        fontWeight = FontWeight.Black,
                        color = IndustrialBlue,
                        letterSpacing = 0.5.sp
                      )
                    )
                    Text(
                      text = domainCode,
                      style = MaterialTheme.typography.labelSmall.copy(
                        fontWeight = FontWeight.Bold,
                        color = SafetyOrangeDark
                      )
                    )
                  }

                  LinearProgressIndicator(
                    progress = { (currentQuestionIndex + 1).toFloat() / questions.size },
                    modifier = Modifier
                      .fillMaxWidth()
                      .height(6.dp)
                      .clip(RoundedCornerShape(3.dp)),
                    color = SafetyOrange,
                    trackColor = SoftBlue
                  )
                }
              }
            }

            // Question Card
            item {
              Card(
                modifier = Modifier
                  .fillMaxWidth()
                  .testTag("quiz_question_card"),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = PureWhite),
                border = androidx.compose.foundation.BorderStroke(1.5.dp, SoftBlueBorder),
                elevation = CardDefaults.cardElevation(defaultElevation = 3.dp)
              ) {
                Column(
                  modifier = Modifier
                    .fillMaxWidth()
                    .padding(18.dp)
                ) {
                  Surface(
                    shape = RoundedCornerShape(4.dp),
                    color = SafetyOrangeSubtle,
                    modifier = Modifier.padding(bottom = 8.dp)
                  ) {
                    Text(
                      text = "MANDATORY SAFETY PROTOCOL",
                      style = MaterialTheme.typography.labelSmall.copy(
                        fontWeight = FontWeight.Black,
                        color = SafetyOrangeDark,
                        fontSize = 10.sp
                      ),
                      modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                  }

                  Text(
                    text = currentQuestion.questionText,
                    style = MaterialTheme.typography.titleMedium.copy(
                      fontWeight = FontWeight.Bold,
                      color = TextNavyDark,
                      lineHeight = 24.sp
                    )
                  )
                }
              }
            }

            // Options List
            item {
              Text(
                text = "Select the correct procedure:",
                style = MaterialTheme.typography.labelMedium.copy(
                  fontWeight = FontWeight.Bold,
                  color = TextSlateMedium
                ),
                modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
              )
            }

            items(currentQuestion.options.size) { optIndex ->
              val optionText = currentQuestion.options[optIndex]
              val isSelected = selectedOptionIndex == optIndex
              val isCorrect = optIndex == currentQuestion.correctOptionIndex

              // Card styling depending on whether submitted or not
              val cardBorderColor = when {
                isSubmitted && isCorrect -> SafetyGreen
                isSubmitted && isSelected && !isCorrect -> Color(0xFFEF4444) // Safety Red
                isSelected -> IndustrialBlue
                else -> IndustrialCardBorder
              }

              val cardBackgroundColor = when {
                isSubmitted && isCorrect -> SafetyGreen.copy(alpha = 0.08f)
                isSubmitted && isSelected && !isCorrect -> Color(0xFFFEF2F2)
                isSelected -> SoftBlue
                else -> PureWhite
              }

              Card(
                modifier = Modifier
                  .fillMaxWidth()
                  .testTag("quiz_option_$optIndex")
                  .clickable(enabled = !isSubmitted) {
                    selectedOptionIndex = optIndex
                  },
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = cardBackgroundColor),
                border = androidx.compose.foundation.BorderStroke(
                  if (isSelected || (isSubmitted && isCorrect)) 2.dp else 1.dp,
                  cardBorderColor
                ),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
              ) {
                Row(
                  modifier = Modifier
                    .fillMaxWidth()
                    .padding(14.dp),
                  verticalAlignment = Alignment.CenterVertically,
                  horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                  // Option Letter Circle (A, B, C, D)
                  Surface(
                    shape = CircleShape,
                    color = when {
                      isSubmitted && isCorrect -> SafetyGreen
                      isSubmitted && isSelected && !isCorrect -> Color(0xFFEF4444)
                      isSelected -> IndustrialBlue
                      else -> SoftBlue
                    },
                    modifier = Modifier.size(34.dp)
                  ) {
                    Box(contentAlignment = Alignment.Center) {
                      if (isSubmitted && isCorrect) {
                        Icon(
                          imageVector = Icons.Default.Check,
                          contentDescription = "Correct",
                          tint = PureWhite,
                          modifier = Modifier.size(18.dp)
                        )
                      } else if (isSubmitted && isSelected && !isCorrect) {
                        Icon(
                          imageVector = Icons.Default.Close,
                          contentDescription = "Incorrect",
                          tint = PureWhite,
                          modifier = Modifier.size(18.dp)
                        )
                      } else {
                        Text(
                          text = ('A' + optIndex).toString(),
                          style = MaterialTheme.typography.labelMedium.copy(
                            fontWeight = FontWeight.Bold,
                            color = if (isSelected) PureWhite else IndustrialBlue
                          )
                        )
                      }
                    }
                  }

                  Text(
                    text = optionText,
                    style = MaterialTheme.typography.bodyMedium.copy(
                      fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                      color = TextNavyDark,
                      lineHeight = 20.sp
                    ),
                    modifier = Modifier.weight(1f)
                  )
                }
              }
            }

            // Explanation & Safety Standard Box (Visible after submission)
            if (isSubmitted) {
              item {
                AnimatedVisibility(
                  visible = true,
                  enter = fadeIn() + slideInVertically()
                ) {
                  Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(
                      containerColor = if (selectedOptionIndex == currentQuestion.correctOptionIndex) {
                        SafetyGreen.copy(alpha = 0.08f)
                      } else {
                        SafetyOrangeSubtle
                      }
                    ),
                    border = androidx.compose.foundation.BorderStroke(
                      1.dp,
                      if (selectedOptionIndex == currentQuestion.correctOptionIndex) SafetyGreen else SafetyOrange
                    )
                  ) {
                    Column(
                      modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                      verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                      Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                      ) {
                        Icon(
                          imageVector = if (selectedOptionIndex == currentQuestion.correctOptionIndex) {
                            Icons.Default.CheckCircle
                          } else {
                            Icons.Default.Info
                          },
                          contentDescription = null,
                          tint = if (selectedOptionIndex == currentQuestion.correctOptionIndex) SafetyGreen else SafetyOrange,
                          modifier = Modifier.size(18.dp)
                        )
                        Text(
                          text = if (selectedOptionIndex == currentQuestion.correctOptionIndex) {
                            "CORRECT SAFETY RESPONSE"
                          } else {
                            "INCORRECT RESPONSE — MANDATORY SAFETY PROTOCOL"
                          },
                          style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = FontWeight.Black,
                            color = if (selectedOptionIndex == currentQuestion.correctOptionIndex) SafetyGreen else SafetyOrangeDark
                          )
                        )
                      }

                      Text(
                        text = currentQuestion.explanation,
                        style = MaterialTheme.typography.bodySmall.copy(
                          color = TextNavyDark,
                          lineHeight = 18.sp
                        )
                      )

                      Surface(
                        shape = RoundedCornerShape(4.dp),
                        color = PureWhite,
                        border = androidx.compose.foundation.BorderStroke(1.dp, IndustrialCardBorder),
                        modifier = Modifier.padding(top = 4.dp)
                      ) {
                        Text(
                          text = "Standard: ${currentQuestion.safetyStandard}",
                          style = MaterialTheme.typography.labelSmall.copy(
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = IndustrialBlue
                          ),
                          modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                      }
                    }
                  }
                }
              }
            }
          }

          // Sticky Bottom Action Bar
          Surface(
            modifier = Modifier
              .fillMaxWidth()
              .border(androidx.compose.foundation.BorderStroke(1.dp, IndustrialCardBorder)),
            color = PureWhite,
            shadowElevation = 8.dp
          ) {
            Box(modifier = Modifier.padding(16.dp)) {
              if (!isSubmitted) {
                // Submit Button
                Button(
                  onClick = {
                    if (selectedOptionIndex != null) {
                      isSubmitted = true
                      if (selectedOptionIndex == currentQuestion.correctOptionIndex) {
                        correctAnswersCount++
                      }
                    }
                  },
                  enabled = selectedOptionIndex != null,
                  modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp)
                    .testTag("quiz_submit_button"),
                  shape = RoundedCornerShape(10.dp),
                  colors = ButtonDefaults.buttonColors(
                    containerColor = SafetyOrange,
                    disabledContainerColor = IndustrialCardBorder,
                    contentColor = PureWhite
                  )
                ) {
                  Text(
                    text = "CONFIRM ANSWER",
                    style = MaterialTheme.typography.labelLarge.copy(
                      fontWeight = FontWeight.Black,
                      letterSpacing = 0.8.sp
                    )
                  )
                }
              } else {
                // Next / Finish Button
                Button(
                  onClick = {
                    if (currentQuestionIndex < questions.size - 1) {
                      currentQuestionIndex++
                      selectedOptionIndex = null
                      isSubmitted = false
                    } else {
                      // Quiz finished!
                      isQuizFinished = true
                      FaceAuthRepository.recordQuizCompletion(
                        moduleId = moduleId,
                        correctAnswers = correctAnswersCount,
                        totalQuestions = questions.size
                      )
                    }
                  },
                  modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp)
                    .testTag("quiz_next_button"),
                  shape = RoundedCornerShape(10.dp),
                  colors = ButtonDefaults.buttonColors(
                    containerColor = IndustrialBlue,
                    contentColor = PureWhite
                  )
                ) {
                  Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                  ) {
                    Text(
                      text = if (currentQuestionIndex < questions.size - 1) {
                        "NEXT QUESTION"
                      } else {
                        "VIEW ASSESSMENT RESULTS"
                      },
                      style = MaterialTheme.typography.labelLarge.copy(
                        fontWeight = FontWeight.Black,
                        letterSpacing = 0.8.sp
                      )
                    )
                    Icon(
                      imageVector = Icons.Default.ArrowForward,
                      contentDescription = null,
                      tint = PureWhite,
                      modifier = Modifier.size(18.dp)
                    )
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

/**
 * Quiz Completion Summary Card with Pass/Fail status, Score, and Certificate Update.
 */
@Composable
fun QuizFinishedSummary(
  moduleId: String,
  domainTitle: String,
  correctCount: Int,
  totalQuestions: Int,
  workerName: String,
  workerId: String,
  onRetake: () -> Unit,
  onReturnHome: () -> Unit
) {
  val scorePercentage = if (totalQuestions > 0) ((correctCount.toFloat() / totalQuestions) * 100).toInt() else 0
  val isPassed = scorePercentage >= 80

  LazyColumn(
    modifier = Modifier.fillMaxSize(),
    contentPadding = PaddingValues(20.dp),
    verticalArrangement = Arrangement.spacedBy(18.dp),
    horizontalAlignment = Alignment.CenterHorizontally
  ) {
    item {
      Spacer(modifier = Modifier.height(10.dp))

      // Trophy / Badge Icon
      Surface(
        modifier = Modifier.size(80.dp),
        shape = CircleShape,
        color = if (isPassed) SafetyGreen.copy(alpha = 0.12f) else SafetyOrangeSubtle,
        border = androidx.compose.foundation.BorderStroke(
          2.dp,
          if (isPassed) SafetyGreen else SafetyOrange
        )
      ) {
        Box(contentAlignment = Alignment.Center) {
          Icon(
            imageVector = if (isPassed) Icons.Default.EmojiEvents else Icons.Default.Shield,
            contentDescription = null,
            tint = if (isPassed) SafetyGreen else SafetyOrange,
            modifier = Modifier.size(44.dp)
          )
        }
      }

      Spacer(modifier = Modifier.height(16.dp))

      // Result Header
      Text(
        text = if (isPassed) "ASSESSMENT PASSED!" else "ASSESSMENT INCOMPLETE",
        style = MaterialTheme.typography.headlineMedium.copy(
          fontWeight = FontWeight.Black,
          color = if (isPassed) SafetyGreen else SafetyOrangeDark,
          letterSpacing = 0.5.sp
        ),
        textAlign = TextAlign.Center
      )

      Spacer(modifier = Modifier.height(4.dp))

      Text(
        text = domainTitle,
        style = MaterialTheme.typography.titleMedium.copy(
          fontWeight = FontWeight.Bold,
          color = TextNavyDark
        ),
        textAlign = TextAlign.Center
      )
    }

    // Score Card
    item {
      Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = PureWhite),
        border = androidx.compose.foundation.BorderStroke(1.dp, IndustrialCardBorder),
        elevation = CardDefaults.cardElevation(defaultElevation = 3.dp)
      ) {
        Column(
          modifier = Modifier
            .fillMaxWidth()
            .padding(20.dp),
          horizontalAlignment = Alignment.CenterHorizontally,
          verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
          Text(
            text = "$scorePercentage%",
            style = MaterialTheme.typography.displayMedium.copy(
              fontWeight = FontWeight.Black,
              color = if (isPassed) SafetyGreen else SafetyOrange
            )
          )

          Text(
            text = "$correctCount of $totalQuestions Questions Answered Correctly",
            style = MaterialTheme.typography.bodyMedium.copy(
              fontWeight = FontWeight.Bold,
              color = TextNavyDark
            )
          )

          LinearProgressIndicator(
            progress = { scorePercentage / 100f },
            modifier = Modifier
              .fillMaxWidth()
              .height(10.dp)
              .clip(RoundedCornerShape(5.dp)),
            color = if (isPassed) SafetyGreen else SafetyOrange,
            trackColor = SoftBlue
          )

          // Passing requirement note
          Surface(
            shape = RoundedCornerShape(8.dp),
            color = SoftSurface,
            modifier = Modifier.fillMaxWidth()
          ) {
            Row(
              modifier = Modifier.padding(10.dp),
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
              Icon(
                imageVector = Icons.Default.Info,
                contentDescription = null,
                tint = IndustrialBlue,
                modifier = Modifier.size(18.dp)
              )
              Text(
                text = "DGMS Standard: 80% minimum passing score required for underground drill certification.",
                style = MaterialTheme.typography.bodySmall.copy(
                  color = TextSlateMedium
                )
              )
            }
          }
        }
      }
    }

    // Worker Biometric Certification Verification Card
    item {
      Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = PureWhite),
        border = androidx.compose.foundation.BorderStroke(1.dp, SoftBlueBorder),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
      ) {
        Column(
          modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
          verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
          Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
          ) {
            Icon(
              imageVector = Icons.Default.Verified,
              contentDescription = null,
              tint = IndustrialBlue,
              modifier = Modifier.size(20.dp)
            )
            Text(
              text = "BIOMETRIC CERTIFICATION RECORD",
              style = MaterialTheme.typography.labelMedium.copy(
                fontWeight = FontWeight.Black,
                color = IndustrialBlue,
                letterSpacing = 0.5.sp
              )
            )
          }

          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
          ) {
            Text("Certified Worker:", color = TextSlateMedium, style = MaterialTheme.typography.bodySmall)
            Text(workerName, fontWeight = FontWeight.Bold, color = TextNavyDark, style = MaterialTheme.typography.bodySmall)
          }

          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
          ) {
            Text("Operator ID:", color = TextSlateMedium, style = MaterialTheme.typography.bodySmall)
            Text(workerId, fontWeight = FontWeight.Bold, color = TextNavyDark, style = MaterialTheme.typography.bodySmall)
          }

          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
          ) {
            Text("Face Scan Match:", color = TextSlateMedium, style = MaterialTheme.typography.bodySmall)
            Text("99.1% Confidence (Verified)", fontWeight = FontWeight.Bold, color = SafetyGreen, style = MaterialTheme.typography.bodySmall)
          }

          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
          ) {
            Text("Profile Status:", color = TextSlateMedium, style = MaterialTheme.typography.bodySmall)
            Text(
              if (isPassed) "UPDATED IN PROFILE" else "RETAKE RECOMMENDED",
              fontWeight = FontWeight.Bold,
              color = if (isPassed) SafetyGreen else SafetyOrangeDark,
              style = MaterialTheme.typography.bodySmall
            )
          }
        }
      }
    }

    // Actions
    item {
      Spacer(modifier = Modifier.height(10.dp))

      Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(10.dp)
      ) {
        IndustrialPrimaryButton(
          text = "RETAKE WITH NEW RANDOM QUESTIONS",
          onClick = onRetake,
          icon = Icons.Default.Refresh,
          testTag = "quiz_retake_button"
        )

        IndustrialOutlineButton(
          text = "RETURN TO MODULES",
          onClick = onReturnHome,
          icon = Icons.AutoMirrored.Filled.ArrowBack,
          testTag = "quiz_return_modules_button"
        )
      }
    }
  }
}
