package com.example

import com.example.data.FaceAuthRepository
import com.example.data.QuizRepository
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class QuizAndFaceAuthTest {

  @Test
  fun `verify domains exist and questions are randomized`() {
    val domains = listOf("fire_extinguisher", "gas_leakage", "confined_space", "ppe_emergency")

    for (domainId in domains) {
      val questions = QuizRepository.getRandomQuestions(domainId, count = 5)
      assertEquals("Should return 5 questions for domain $domainId", 5, questions.size)

      for (q in questions) {
        assertEquals("Question should belong to $domainId", domainId, q.domainId)
        assertEquals("Question should have 4 options", 4, q.options.size)
        assertTrue("Correct option index should be between 0 and 3", q.correctOptionIndex in 0..3)
        assertTrue("Question text should not be empty", q.questionText.isNotBlank())
        assertTrue("Explanation should not be empty", q.explanation.isNotBlank())
      }
    }
  }

  @Test
  fun `verify face authentication matches login face profile`() {
    FaceAuthRepository.enrollFaceAtLogin(
      workerName = "Rajesh Kumar Murmu",
      workerId = "MIN-84920"
    )

    val profile = FaceAuthRepository.workerProfile.value
    assertEquals("Rajesh Kumar Murmu", profile.name)
    assertEquals("MIN-84920", profile.workerId)
    assertTrue("Face should be enrolled", profile.isFaceEnrolled)

    // Verification must match login face
    val result = FaceAuthRepository.verifyAgainstLoginFace()
    assertTrue("Face verification must succeed", result.isSuccess)
    assertEquals("Rajesh Kumar Murmu", result.matchedWorkerName)
    assertEquals("MIN-84920", result.matchedWorkerId)
    assertTrue("Confidence should exceed 98%", result.confidenceScore >= 98f)
  }

  @Test
  fun `verify quiz completion updates certification score and progress`() {
    FaceAuthRepository.recordQuizCompletion(
      moduleId = "confined_space",
      correctAnswers = 5,
      totalQuestions = 5
    )

    val certs = FaceAuthRepository.moduleCertifications.value
    val confinedCert = certs["confined_space"]
    assertNotNull(confinedCert)
    assertEquals(100, confinedCert?.scorePercentage)
    assertEquals(true, confinedCert?.isPassed)

    assertTrue("Certified count should be at least 3", FaceAuthRepository.getCertifiedCount() >= 3)
  }
}
