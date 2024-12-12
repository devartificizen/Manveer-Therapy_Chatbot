'use client';
import VoiceWaveAnimation from "./VoiceWaveAnimation";

interface VoiceChatProps {
  isRecording: boolean;
  isSpeaking: boolean;
  onToggleRecording: () => void;
  onStop: () => void;
  onStopSpeaking: () => void;
  onClose: () => void;
}

const VoiceChat = (props: VoiceChatProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <VoiceWaveAnimation {...props} />
    </div>
  );
};

export default VoiceChat;
