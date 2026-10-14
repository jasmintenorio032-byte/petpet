import * as LocalAuthentication from "expo-local-authentication";

export async function authenticateWithBiometrics() {
  // Check if the phone has biometric hardware
  const hasHardware = await LocalAuthentication.hasHardwareAsync();

  if (!hasHardware) {
    return {
      success: false,
      message: "This phone does not support biometrics.",
    };
  }

  // Check if fingerprint or face recognition is registered
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (!isEnrolled) {
    return {
      success: false,
      message:
        "Please set up fingerprint authentication in your phone settings.",
    };
  }

  // Display the phone's biometric authentication prompt
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Login to HEHEHE",
    cancelLabel: "Cancel",
    disableDeviceFallback: true,
  });

  return {
    success: result.success,
    message: result.success
      ? "Fingerprint verified successfully!"
      : "Biometric authentication failed or cancelled.",
  };
}