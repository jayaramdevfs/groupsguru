package com.groupsguru.question;

import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class CsvQuestionParser {

    public List<Question> parse(InputStream inputStream) throws Exception {
        List<Question> questions = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
            String headerLine = br.readLine(); // skip header
            if (headerLine == null) {
                return questions;
            }

            String line;
            while ((line = readLineWithQuotes(br)) != null) {
                if (line.trim().isEmpty()) continue;
                String[] parsed = parseCsvLine(line);
                String[] values = new String[19];
                for (int i = 0; i < 19; i++) {
                    values[i] = i < parsed.length ? parsed[i] : "";
                }

                Question q = new Question();
                q.setQuestionCode(values[0]);
                q.setQuestionTextEn(values[1]);
                q.setQuestionTextTe(values[2]);
                q.setOptionAEn(values[3]);
                q.setOptionATe(values[4]);
                q.setOptionBEn(values[5]);
                q.setOptionBTe(values[6]);
                q.setOptionCEn(values[7]);
                q.setOptionCTe(values[8]);
                q.setOptionDEn(values[9]);
                q.setOptionDTe(values[10]);
                q.setCorrectOption(values[11]);
                q.setExplanationEn(values[12]);
                q.setExplanationTe(values[13]);
                q.setMicroTopicId(values[14]);
                q.setSubject(values[15]);
                q.setDifficulty(values[16]);
                q.setCognitiveLevel(values[17]);
                q.setQuestionType(values[18]);
                q.setSprintId("BULK");

                questions.add(q);
            }
        }
        return questions;
    }

    private String readLineWithQuotes(BufferedReader br) throws Exception {
        String line = br.readLine();
        if (line == null) return null;
        while (countQuotes(line) % 2 != 0) {
            String nextLine = br.readLine();
            if (nextLine == null) break;
            line += "\n" + nextLine;
        }
        return line;
    }

    private int countQuotes(String s) {
        int count = 0;
        for (char c : s.toCharArray()) {
            if (c == '"') count++;
        }
        return count;
    }

    private String[] parseCsvLine(String line) {
        List<String> result = new ArrayList<>();
        boolean inQuotes = false;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '"') {
                    sb.append('"');
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (c == ',' && !inQuotes) {
                result.add(sb.toString().trim());
                sb.setLength(0);
            } else {
                sb.append(c);
            }
        }
        result.add(sb.toString().trim());
        return result.toArray(new String[0]);
    }
}
