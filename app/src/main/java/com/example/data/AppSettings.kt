package com.example.data

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

object AppSettings {
  private val _currentLanguage = MutableStateFlow(Language.ENGLISH)
  val currentLanguage: StateFlow<Language> = _currentLanguage.asStateFlow()

  private val _audioNarration = MutableStateFlow(true)
  val audioNarration: StateFlow<Boolean> = _audioNarration.asStateFlow()

  private val _hapticFeedback = MutableStateFlow(true)
  val hapticFeedback: StateFlow<Boolean> = _hapticFeedback.asStateFlow()

  private val _notifications = MutableStateFlow(true)
  val notifications: StateFlow<Boolean> = _notifications.asStateFlow()

  const val OFFLINE_MODE_ENABLED: Boolean = true

  fun setLanguage(language: Language) {
    _currentLanguage.value = language
  }

  fun setAudioNarration(enabled: Boolean) {
    _audioNarration.value = enabled
  }

  fun setHapticFeedback(enabled: Boolean) {
    _hapticFeedback.value = enabled
  }

  fun setNotifications(enabled: Boolean) {
    _notifications.value = enabled
  }
}
