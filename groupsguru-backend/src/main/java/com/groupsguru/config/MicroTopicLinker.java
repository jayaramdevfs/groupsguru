package com.groupsguru.config;

import com.groupsguru.registry.MicroTopic;
import com.groupsguru.registry.MicroTopicRepository;
import com.groupsguru.topic.Topic;
import com.groupsguru.topic.TopicRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@Order(3)
public class MicroTopicLinker implements CommandLineRunner {

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private MicroTopicRepository microTopicRepository;

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void run(String... args) throws Exception {
        log.info("Starting MicroTopicLinker...");
        List<Topic> topics = topicRepository.findAll();
        List<MicroTopic> microTopics = microTopicRepository.findAll();
        int linkedCount = 0;

        for (MicroTopic mt : microTopics) {
            if (mt.getTopicName() == null) continue;
            String mtName = normalize(mt.getTopicName());
            String mtSubject = normalize(mt.getSubject());
            String mtSectionName = normalize(mt.getSectionName());

            Topic match = null;

            // Phase 1 — EXACT match
            List<Topic> exactMatches = topics.stream()
                    .filter(t -> normalize(t.getName()).equals(mtName))
                    .toList();
            if (exactMatches.size() == 1) {
                match = exactMatches.get(0);
                log.info("Phase 1: {} -> Topic '{}' (id={})", mt.getMicroTopicId(), match.getName(), match.getId());
            }

            // Phase 2 — Subject + Section context match
            if (match == null) {
                List<Topic> contextFiltered = topics.stream()
                        .filter(t -> t.getSection() != null && t.getSection().getSubCategory() != null &&
                                normalize(t.getSection().getSubCategory().getName()).contains(mtSubject))
                        .filter(t -> t.getSection() != null && sharesKeyword(normalize(t.getSection().getName()), mtSectionName))
                        .toList();

                Topic bestContextMatch = null;
                int bestContextLen = 0;
                for (Topic t : contextFiltered) {
                    String tName = normalize(t.getName());
                    if (mtName.startsWith(tName) && tName.length() > bestContextLen) {
                        bestContextMatch = t;
                        bestContextLen = tName.length();
                    }
                }
                if (bestContextMatch != null) {
                    match = bestContextMatch;
                    log.info("Phase 2: {} -> Topic '{}' (id={})", mt.getMicroTopicId(), match.getName(), match.getId());
                }
            }

            // Phase 3 — Guarded startsWith fallback
            if (match == null) {
                Topic bestGuardMatch = null;
                int bestGuardLen = 0;
                for (Topic t : topics) {
                    if (t.getSection() != null && t.getSection().getSubCategory() != null &&
                            normalize(t.getSection().getSubCategory().getName()).contains(mtSubject)) {
                        String tName = normalize(t.getName());
                        if (mtName.startsWith(tName) && tName.length() > bestGuardLen) {
                            bestGuardMatch = t;
                            bestGuardLen = tName.length();
                        }
                    }
                }
                if (bestGuardMatch != null) {
                    match = bestGuardMatch;
                    log.info("Phase 3: {} -> Topic '{}' (id={})", mt.getMicroTopicId(), match.getName(), match.getId());
                }
            }

            if (match != null) {
                mt.setTopicId(match.getId());
                microTopicRepository.save(mt);
                linkedCount++;
            }
        }
        log.info("Linked {} micro-topics to topics", linkedCount);
    }

    private String normalize(String str) {
        if (str == null) return "";
        return str.toUpperCase().replaceAll("[^A-Z0-9]+", " ").trim();
    }

    private boolean sharesKeyword(String str1, String str2) {
        if (str1 == null || str2 == null) return false;
        String[] words1 = str1.split("\\s+");
        String[] words2 = str2.split("\\s+");
        for (String w1 : words1) {
            if (w1.length() >= 3) {
                for (String w2 : words2) {
                    if (w1.equals(w2)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
