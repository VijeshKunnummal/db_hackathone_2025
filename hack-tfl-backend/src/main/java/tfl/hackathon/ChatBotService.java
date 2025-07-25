package tfl.hackathon;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Chat;
import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.Part;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatBotService {
    private static final Logger logger = LoggerFactory.getLogger(ChatBotService.class);
    private final Client client;
    private final Map<String, Chat> chatSessions;
    private final String modelId;
    private static final String VIDEO_ANALYSIS_PROMPT =
                    """
                    You will receive a video or an audio file. It is a startup pitch. Please do the following:
                        1. Transcribe the pitch  in plain text in one string value and not an array.
                        2. Summarize the speaker’s tone (confident, unsure, passionate, etc).
                        3. Does it feel authentic and trustworthy? (Yes/No, why?)
                        4. Provide the location, name of the shops and text in the signs and boards
                        5. Provide other aspects like the crowd
                        6. Provide a 2–3 line business potential assessment.
                    Return in JSON format.
                    """;
    private static final Map<String, String> PROMPTS = new HashMap<>();

    static {
        PROMPTS.put("loan", """
                    You are a virtual agent with extensive knowledge of business loans. Your primary goal is to collect necessary information from business loan applicants to assess their loan eligibility and calculate their risk score
    
                    Follow these steps to gather information from the business loan applicant
                    1. Begin by introducing yourself and explaining that you need to collect some information to access their loan eligibility and calculate their risk score
                    2. Ask a maximum of 10 relevant questions. Ensure each question is clear and concise. Ask one question at a time.
                    3. Ask following questions to the customer and maintain the order of the questions
                      * Purpose of interaction
                      * Business Description
                      * Loan Amount
                      * Loan Tenure
                    4. Show "Processing your request"
                    """);
        PROMPTS.put("game", """
                     You are a highly skilled and persuasive sales agent with exceptional convincing abilities. Your goal is to prompt the given text to the customer
                     You will be provided with the following customer name: "Tasha"
        
                     Prompt customer the following text
                     In order to get additional funding, we challenge you to complete the milestone which will enable you additional credit: PLAY NOW
                    """);
        PROMPTS.put("tutor", """
                    You are a highly skilled and persuasive sales agent with exceptional convincing abilities. Your goal is to prompt the given text to the customer. Do not wait for customer to greet
                    
                    You will be provided with the following customer name: "Tasha"
                    
                    Prompt customer the following text
                    We highly recommend you to take our elevate AI tutor to have additional insights on how to grow your business and avail funding
                    """);
    }

    public ChatBotService(Client client, @Value("${gemini.model.id}") String modelId) {
        this.client = client;
        this.modelId = modelId;
        chatSessions = new HashMap<>();
    }

    public ChatResponse chat(String userId, String message) {

        var chat = chatSessions.computeIfAbsent(userId, (key) -> client.chats.create(modelId));
        logger.info("Sending chat message: {}", message);
        var response = chat.sendMessage(message);

        return new ChatResponse(response.text());
    }

    public ChatResponse prompt(String userId, String message, String type) {
        var chat = chatSessions.computeIfAbsent(userId, (key) -> client.chats.create(modelId));

        logger.info("Sending {} prompt with message: {}", type, message);
        var response = chat.sendMessage(message, GenerateContentConfig.builder()
                .systemInstruction(Content.fromParts(Part.fromText(PROMPTS.get(type))))
                .build());

        return new ChatResponse(response.text());
    }

    public List<String> history(String userId) {
        logger.info("Retrieving chat history for: {}", userId);
        var chat = chatSessions.get(userId);
        if (chat != null) {
            var history = chat.getHistory(true);
            return history.stream().map(Content::text).toList();
        }
        return List.of();
    }

    public ChatResponse audioChat(String userId, MultipartFile file) {
        try {
            byte[] audioBytes = file.getBytes();
            String mimeType = file.getContentType();

            var chat = chatSessions.computeIfAbsent(userId, (key) -> client.chats.create(modelId));
            logger.info("Sending audio for chat: {}", file.getOriginalFilename());

            var content = Content.fromParts(Part.fromText("The user input is captured in the audio file."), Part.fromBytes(audioBytes, mimeType));
            var response = chat.sendMessage(content, null);

            return new ChatResponse(response.text());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public VideoAnalysisResponse analyzeVideo(String userId, MultipartFile file) {
        try {
            byte[] videoBytes = file.getBytes();
            String mimeType = file.getContentType();

            logger.info("Sending video for analysis: {}", file.getOriginalFilename());
            var content = Content.fromParts(Part.fromText(VIDEO_ANALYSIS_PROMPT), Part.fromBytes(videoBytes, mimeType));
            var response = client.models.generateContent(modelId, content, null).text();

            ObjectMapper mapper = new ObjectMapper();
            String json = response.substring(response.indexOf("{"), response.lastIndexOf("}") + 1);
            Map result = mapper.readValue(json, HashMap.class);
            return new VideoAnalysisResponse(result);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public String updatePrompt(String type, String content) {
        PROMPTS.put(type, content);
        return "Successfully updated prompt " + type;
    }

    public Map<String, String> getAllPrompts() {
        return PROMPTS;
    }
}
