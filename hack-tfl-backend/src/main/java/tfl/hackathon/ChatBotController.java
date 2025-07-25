package tfl.hackathon;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
public class ChatBotController {
    private final ChatBotService chatBotService;

    public ChatBotController(ChatBotService chatBotService) {
        this.chatBotService = chatBotService;
    }

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {
        return chatBotService.chat(request.getUserId(), request.getMessage());
    }

    @PostMapping("/prompt")
    public ChatResponse prompt(@RequestBody ChatRequest request, @RequestParam String type) {
        return chatBotService.prompt(request.getUserId(), request.getMessage(), type);
    }

    @GetMapping("/chat-history")
    public List<String> getHistory(@RequestParam String userId) {
        return chatBotService.history(userId);
    }

    @PostMapping("/analyze-video")
    public VideoAnalysisResponse analyze(@RequestParam String userId, @RequestParam("file") MultipartFile file) {
        return chatBotService.analyzeVideo(userId, file);
    }

    @PostMapping("/audio-chat")
    public ChatResponse audioChat(@RequestParam String userId, @RequestParam("file") MultipartFile file) {
        return chatBotService.audioChat(userId, file);
    }

    @PostMapping("/update-prompt")
    public String updatePrompt(@RequestBody UpdatePromptRequest request) {
        return chatBotService.updatePrompt(request.getType(), request.getContent());
    }

    @GetMapping("/prompts")
    public Map<String, String> getAllPrompts() {
        return chatBotService.getAllPrompts();
    }
}
