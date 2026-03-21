package com.groupsguru.question;

import org.springframework.stereotype.Service;
import org.w3c.dom.CharacterData;
import org.w3c.dom.*;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class MoodleXmlParser {

    public List<Question> parse(InputStream inputStream) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document document = builder.parse(inputStream);
        document.getDocumentElement().normalize();

        List<Question> questions = new ArrayList<>();
        NodeList qNodes = document.getElementsByTagName("question");

        for (int i = 0; i < qNodes.getLength(); i++) {
            Node qNode = qNodes.item(i);
            if (qNode.getNodeType() == Node.ELEMENT_NODE) {
                Element qElement = (Element) qNode;
                String type = qElement.getAttribute("type");
                
                if ("multichoice".equals(type)) {
                    questions.add(parseQuestion(qElement));
                }
            }
        }
        return questions;
    }

    private Question parseQuestion(Element qElement) throws Exception {
        Question q = new Question();
        
        // questionCode
        String qCode = getTextContent(qElement, "name");
        q.setQuestionCode(qCode);

        // questionText
        String qTextRaw = getCdataContent(qElement, "questiontext");
        q.setQuestionTextEn(extractLangSpan(qTextRaw, "en"));
        q.setQuestionTextTe(extractLangSpan(qTextRaw, "te"));

        // Penalty
        NodeList penaltyList = qElement.getElementsByTagName("penalty");
        if (penaltyList.getLength() > 0) {
            String pVal = penaltyList.item(0).getTextContent().trim();
            if (!pVal.isEmpty()) {
                q.setPenalty(Double.parseDouble(pVal));
            }
        }

        // Options
        NodeList answerNodes = qElement.getElementsByTagName("answer");
        String correctOpt = null;
        char optChar = 'A';
        for (int i = 0; i < answerNodes.getLength() && i < 4; i++) {
            Element ansElement = (Element) answerNodes.item(i);
            String fraction = ansElement.getAttribute("fraction");
            if ("100".equals(fraction)) {
                correctOpt = String.valueOf(optChar);
                // Extract explanation from feedback if fraction 100
                String feedbackRaw = getCdataContent(ansElement, "feedback");
                if (feedbackRaw != null) {
                    q.setExplanationEn(extractLangSpan(feedbackRaw, "en"));
                    q.setExplanationTe(extractLangSpan(feedbackRaw, "te"));
                }
            }

            String ansTextRaw = getCdataContentFromElement(ansElement, "text");
            String enOpt = extractLangSpan(ansTextRaw, "en");
            String teOpt = extractLangSpan(ansTextRaw, "te");

            if (optChar == 'A') { q.setOptionAEn(enOpt); q.setOptionATe(teOpt); }
            else if (optChar == 'B') { q.setOptionBEn(enOpt); q.setOptionBTe(teOpt); }
            else if (optChar == 'C') { q.setOptionCEn(enOpt); q.setOptionCTe(teOpt); }
            else if (optChar == 'D') { q.setOptionDEn(enOpt); q.setOptionDTe(teOpt); }

            optChar++;
        }
        q.setCorrectOption(correctOpt);

        // Tags
        NodeList tagsNodeList = qElement.getElementsByTagName("tags");
        if (tagsNodeList.getLength() > 0) {
            Element tagsElement = (Element) tagsNodeList.item(0);
            NodeList tagNodes = tagsElement.getElementsByTagName("tag");
            for (int i = 0; i < tagNodes.getLength(); i++) {
                Element tagElement = (Element) tagNodes.item(i);
                String tagText = getTextContent(tagElement, "text");
                if (tagText != null && tagText.contains(":")) {
                    String[] parts = tagText.split(":", 2);
                    String key = parts[0].trim();
                    String val = parts[1].trim();
                    switch (key) {
                        case "micro_topic_id": q.setMicroTopicId(val); break;
                        case "subject": q.setSubject(val); break;
                        case "difficulty": q.setDifficulty(val); break;
                        case "cognitive_level": q.setCognitiveLevel(val); break;
                        case "question_type": q.setQuestionType(val); break;
                        case "sprint": q.setSprintId(val); break;
                    }
                }
            }
        }

        return q;
    }

    private String getTextContent(Element parent, String tagName) {
        NodeList nl = parent.getElementsByTagName(tagName);
        if (nl.getLength() > 0) {
            Element el = (Element) nl.item(0);
            NodeList textList = el.getElementsByTagName("text");
            if (textList.getLength() > 0) {
                return textList.item(0).getTextContent().trim();
            }
            return el.getTextContent().trim();
        }
        return null;
    }

    private String getCdataContent(Element parent, String tagName) {
        NodeList nl = parent.getElementsByTagName(tagName);
        if (nl.getLength() > 0) {
            Element el = (Element) nl.item(0);
            return getCdataContentFromElement(el, "text");
        }
        return null;
    }

    private String getCdataContentFromElement(Element parent, String tagName) {
        NodeList nl = parent.getElementsByTagName(tagName);
        if (nl.getLength() > 0) {
            Element el = (Element) nl.item(0);
            Node child = el.getFirstChild();
            while (child != null) {
                if (child instanceof CharacterData) {
                    return ((CharacterData) child).getData().trim();
                }
                child = child.getNextSibling();
            }
            return el.getTextContent().trim();
        }
        return null;
    }

    private String extractLangSpan(String text, String lang) {
        if (text == null) return null;
        String patternStr = "<span[^>]*lang=\"" + lang + "\"[^>]*>(.*?)</span>";
        Pattern p = Pattern.compile(patternStr, Pattern.DOTALL);
        Matcher m = p.matcher(text);
        if (m.find()) {
            return m.group(1).trim();
        }
        return text.trim(); // Fallback if no spans
    }
}
