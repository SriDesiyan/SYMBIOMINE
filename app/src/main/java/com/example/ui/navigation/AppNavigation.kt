package com.example.ui.navigation

import androidx.compose.animation.AnimatedContentTransitionScope
import androidx.compose.animation.core.tween
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.data.AppSettings
import com.example.data.LocalizationRepository
import com.example.ui.screens.DomainQuizScreen
import com.example.ui.screens.HomeScreen
import com.example.ui.screens.LoginScreen
import com.example.ui.screens.ModuleDetailScreen
import com.example.ui.screens.ProfileScreen
import com.example.ui.screens.SettingsScreen

object Routes {
  const val LOGIN = "login"
  const val HOME = "home"
  const val PROFILE = "profile"
  const val SETTINGS = "settings"
  const val MODULE_DETAIL = "module/{moduleId}"
  const val DOMAIN_QUIZ = "quiz/{moduleId}"

  fun moduleDetail(moduleId: String) = "module/$moduleId"
  fun domainQuiz(moduleId: String) = "quiz/$moduleId"
}

@Composable
fun AppNavigation(
  navController: NavHostController = rememberNavController()
) {
  val currentLanguage by AppSettings.currentLanguage.collectAsStateWithLifecycle()
  val audioNarration by AppSettings.audioNarration.collectAsStateWithLifecycle()
  val hapticFeedback by AppSettings.hapticFeedback.collectAsStateWithLifecycle()
  val notifications by AppSettings.notifications.collectAsStateWithLifecycle()

  val strings = LocalizationRepository.getStrings(currentLanguage)

  NavHost(
    navController = navController,
    startDestination = Routes.LOGIN,
    enterTransition = {
      slideIntoContainer(
        AnimatedContentTransitionScope.SlideDirection.Left,
        animationSpec = tween(280)
      )
    },
    exitTransition = {
      slideOutOfContainer(
        AnimatedContentTransitionScope.SlideDirection.Left,
        animationSpec = tween(280)
      )
    },
    popEnterTransition = {
      slideIntoContainer(
        AnimatedContentTransitionScope.SlideDirection.Right,
        animationSpec = tween(280)
      )
    },
    popExitTransition = {
      slideOutOfContainer(
        AnimatedContentTransitionScope.SlideDirection.Right,
        animationSpec = tween(280)
      )
    }
  ) {
    // 1. Login Screen
    composable(Routes.LOGIN) {
      LoginScreen(
        strings = strings,
        currentLanguage = currentLanguage,
        onLanguageChange = { AppSettings.setLanguage(it) },
        onLoginSuccess = {
          navController.navigate(Routes.HOME) {
            popUpTo(Routes.LOGIN) { inclusive = true }
          }
        },
        onSkip = {
          navController.navigate(Routes.HOME) {
            popUpTo(Routes.LOGIN) { inclusive = true }
          }
        }
      )
    }

    // 2. Home Screen
    composable(Routes.HOME) {
      HomeScreen(
        strings = strings,
        onNavigateToProfile = { navController.navigate(Routes.PROFILE) },
        onNavigateToSettings = { navController.navigate(Routes.SETTINGS) },
        onNavigateToModule = { moduleId ->
          navController.navigate(Routes.moduleDetail(moduleId))
        }
      )
    }

    // 3. Profile Screen
    composable(Routes.PROFILE) {
      ProfileScreen(
        strings = strings,
        onBack = { navController.popBackStack() }
      )
    }

    // 4. Settings Screen
    composable(Routes.SETTINGS) {
      SettingsScreen(
        strings = strings,
        currentLanguage = currentLanguage,
        audioNarration = audioNarration,
        hapticFeedback = hapticFeedback,
        notifications = notifications,
        onLanguageChange = { AppSettings.setLanguage(it) },
        onAudioNarrationChange = { AppSettings.setAudioNarration(it) },
        onHapticFeedbackChange = { AppSettings.setHapticFeedback(it) },
        onNotificationsChange = { AppSettings.setNotifications(it) },
        onBack = { navController.popBackStack() }
      )
    }

    // 5. Training Module Detail Screen
    composable(
      route = Routes.MODULE_DETAIL,
      arguments = listOf(navArgument("moduleId") { type = NavType.StringType })
    ) { backStackEntry ->
      val moduleId = backStackEntry.arguments?.getString("moduleId") ?: "fire_extinguisher"
      ModuleDetailScreen(
        moduleId = moduleId,
        strings = strings,
        onStartAssessment = { id -> navController.navigate(Routes.domainQuiz(id)) },
        onBack = { navController.popBackStack() }
      )
    }

    // 6. Domain-Specific Randomized MCQ Assessment Screen
    composable(
      route = Routes.DOMAIN_QUIZ,
      arguments = listOf(navArgument("moduleId") { type = NavType.StringType })
    ) { backStackEntry ->
      val moduleId = backStackEntry.arguments?.getString("moduleId") ?: "fire_extinguisher"
      DomainQuizScreen(
        moduleId = moduleId,
        strings = strings,
        onBack = { navController.popBackStack() }
      )
    }
  }
}
