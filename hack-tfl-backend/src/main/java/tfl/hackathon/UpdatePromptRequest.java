package tfl.hackathon;

import lombok.Data;

@Data
public class UpdatePromptRequest {
    private String type;
    private String content;
}
