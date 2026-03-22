package com.groupsguru.config;

import com.groupsguru.category.Category;
import com.groupsguru.category.CategoryRepository;
import com.groupsguru.commission.Commission;
import com.groupsguru.commission.CommissionRepository;
import com.groupsguru.section.Section;
import com.groupsguru.section.SectionRepository;
import com.groupsguru.subcategory.SubCategory;
import com.groupsguru.subcategory.SubCategoryRepository;
import com.groupsguru.topic.Topic;
import com.groupsguru.topic.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

@Configuration
@RequiredArgsConstructor
@Order(2)
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final CommissionRepository commissionRepository;
    private final SubCategoryRepository subCategoryRepository;
    private final SectionRepository sectionRepository;
    private final TopicRepository topicRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() > 0) {
            return;
        }

        // Get APPSC commission (already seeded by DataInitializer)
        Commission appsc = commissionRepository.findAll().stream()
                .filter(c -> "APPSC".equals(c.getCode()))
                .findFirst().orElse(null);
        Long appscId = appsc != null ? appsc.getId() : null;

        // ──────────────────────────────────────────────
        // CATEGORY: APPSC Group 1
        // ──────────────────────────────────────────────
        Category g1 = categoryRepository.save(Category.builder()
                .name("APPSC Group 1")
                .nameTe("APPSC గ్రూప్ 1")
                .description("Premium preparation for APPSC Group 1 services — Prelims & Mains.")
                .descriptionTe("APPSC గ్రూప్ 1 సేవల కోసం ప్రీమియం ప్రిపరేషన్ — ప్రిలిమ్స్ & మెయిన్స్.")
                .imageUrl("https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=250&auto=format&fit=crop")
                .commissionId(appscId)
                .build());

        seedGroup1Subjects(g1);

        // ──────────────────────────────────────────────
        // CATEGORY: APPSC Group 2
        // ──────────────────────────────────────────────
        categoryRepository.save(Category.builder()
                .name("APPSC Group 2")
                .nameTe("APPSC గ్రూప్ 2")
                .description("Comprehensive modules for Executive and Non-Executive Group 2 posts.")
                .descriptionTe("ఎగ్జిక్యూటివ్ మరియు నాన్-ఎగ్జిక్యూటివ్ గ్రూప్ 2 పోస్ట్‌ల కోసం సమగ్ర మాడ్యూల్స్.")
                .imageUrl("https://images.unsplash.com/photo-1454165833767-027ffea9e772?q=80&w=250&auto=format&fit=crop")
                .commissionId(appscId)
                .build());

        // ──────────────────────────────────────────────
        // CATEGORY: APPSC Group 3
        // ──────────────────────────────────────────────
        categoryRepository.save(Category.builder()
                .name("APPSC Group 3")
                .nameTe("APPSC గ్రూప్ 3")
                .description("Focused preparation for Panchayat Secretary roles.")
                .descriptionTe("పంచాయతీ కార్యదర్శి పాత్రల కోసం ఫోకస్డ్ ప్రిపరేషన్.")
                .imageUrl("https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=250&auto=format&fit=crop")
                .commissionId(appscId)
                .build());

        // ──────────────────────────────────────────────
        // CATEGORY: APPSC Group 4
        // ──────────────────────────────────────────────
        categoryRepository.save(Category.builder()
                .name("APPSC Group 4")
                .nameTe("APPSC గ్రూప్ 4")
                .description("Preparation for Junior Assistant and related posts.")
                .descriptionTe("జూనియర్ అసిస్టెంట్ మరియు సంబంధిత పోస్ట్‌ల కోసం ప్రిపరేషన్.")
                .imageUrl("https://images.unsplash.com/photo-1501503069356-3c6b82a17d89?q=80&w=250&auto=format&fit=crop")
                .commissionId(appscId)
                .build());

        System.out.println("Seeded APPSC Group 1-4 with full subject hierarchy.");
    }

    private void seedGroup1Subjects(Category g1) {
        // ════════════════════════════════════════
        // SUBJECT 1: History & Culture
        // ════════════════════════════════════════
        SubCategory history = subCategoryRepository.save(SubCategory.builder()
                .name("History & Culture")
                .nameTe("చరిత్ర & సంస్కృతి")
                .description("Indian History, AP History, and Cultural Heritage — Prelims Paper-I & Mains Paper-II.")
                .descriptionTe("భారతదేశ చరిత్ర, ఆంధ్రప్రదేశ్ చరిత్ర మరియు సాంస్కృతిక వారసత్వం.")
                .syllabusCode("HIST")
                .category(g1)
                .build());

        // Section: Ancient India
        Section ancientIndia = sectionRepository.save(Section.builder()
                .name("Ancient India")
                .nameTe("ప్రాచీన భారతదేశం")
                .description("Pre-historic cultures through Gupta Empire.")
                .descriptionTe("ప్రాగైతిహాసిక సంస్కృతుల నుండి గుప్త సామ్రాజ్యం వరకు.")
                .sectionCode("HIST-ANC")
                .subCategory(history)
                .build());

        seedTopics(ancientIndia, new String[][]{
                {"Pre-Historic Cultures in India", "భారతదేశంలో ప్రాగైతిహాసిక సంస్కృతులు", "HIST-ANC-01"},
                {"Indus Valley Civilization", "సింధు లోయ నాగరికత", "HIST-ANC-02"},
                {"Vedic Age", "వేద యుగం", "HIST-ANC-03"},
                {"Mahajanapadas & New Religions", "మహాజనపదాలు & కొత్త మతాలు (జైనం & బౌద్ధం)", "HIST-ANC-04"},
                {"Mauryan Empire", "మౌర్య సామ్రాజ్యం", "HIST-ANC-05"},
                {"Foreign Invasions & Kushans", "విదేశీ దాడులు & కుషాణులు", "HIST-ANC-06"},
                {"Sungas & Gupta Empire", "శుంగులు & గుప్త సామ్రాజ్యం", "HIST-ANC-07"},
                {"Satavahanas & Sangam Age", "శాతవాహనులు & సంగం యుగం", "HIST-ANC-08"},
                {"South Indian Dynasties", "దక్షిణ భారత రాజవంశాలు", "HIST-ANC-09"},
                {"Harsha & Kanauj", "హర్ష & కనౌజ్", "HIST-ANC-10"},
        });

        // Section: Medieval India
        Section medievalIndia = sectionRepository.save(Section.builder()
                .name("Medieval India")
                .nameTe("మధ్యయుగ భారతదేశం")
                .description("Delhi Sultanate through Maratha Empire.")
                .descriptionTe("ఢిల్లీ సుల్తానేట్ నుండి మరాఠా సామ్రాజ్యం వరకు.")
                .sectionCode("HIST-MED")
                .subCategory(history)
                .build());

        seedTopics(medievalIndia, new String[][]{
                {"Delhi Sultanate", "ఢిల్లీ సుల్తానేట్", "HIST-MED-01"},
                {"Vijayanagar Empire", "విజయనగర సామ్రాజ్యం", "HIST-MED-02"},
                {"Mughal Empire", "మొఘల్ సామ్రాజ్యం", "HIST-MED-03"},
                {"Bhakti Movement & Sufism", "భక్తి ఉద్యమం & సూఫీయిజం", "HIST-MED-04"},
                {"Shivaji & Rise of Maratha Empire", "శివాజీ & మరాఠా సామ్రాజ్యం ఆవిర్భావం", "HIST-MED-05"},
        });

        // Section: Modern India
        Section modernIndia = sectionRepository.save(Section.builder()
                .name("Modern India")
                .nameTe("ఆధునిక భారతదేశం")
                .description("European companies, British rule, freedom struggle.")
                .descriptionTe("యూరోపియన్ కంపెనీలు, బ్రిటిష్ పాలన, స్వాతంత్ర్య పోరాటం.")
                .sectionCode("HIST-MOD")
                .subCategory(history)
                .build());

        seedTopics(modernIndia, new String[][]{
                {"European Trading Companies & British Conquest", "యూరోపియన్ వాణిజ్య కంపెనీలు & బ్రిటిష్ ఆక్రమణ", "HIST-MOD-01"},
                {"Revolt of 1857", "1857 తిరుగుబాటు", "HIST-MOD-02"},
                {"Socio-Religious Reform Movements", "సామాజిక-మత సంస్కరణ ఉద్యమాలు", "HIST-MOD-03"},
                {"Indian National Movement", "భారత జాతీయ ఉద్యమం", "HIST-MOD-04"},
        });

        // Section: AP History
        Section apHistory = sectionRepository.save(Section.builder()
                .name("Andhra Pradesh History")
                .nameTe("ఆంధ్రప్రదేశ్ చరిత్ర")
                .description("Ancient Andhra through state formation.")
                .descriptionTe("ప్రాచీన ఆంధ్ర నుండి రాష్ట్ర ఏర్పాటు వరకు.")
                .sectionCode("HIST-AP")
                .subCategory(history)
                .build());

        seedTopics(apHistory, new String[][]{
                {"Ancient Andhra — Satavahanas to Eastern Chalukyas", "ప్రాచీన ఆంధ్ర — శాతవాహనుల నుండి తూర్పు చాళుక్యులు", "HIST-AP-01"},
                {"Medieval Andhra (1000-1565 CE)", "మధ్యయుగ ఆంధ్ర", "HIST-AP-02"},
                {"Modern Andhra (Colonial Period)", "ఆధునిక ఆంధ్ర (వలస కాలం)", "HIST-AP-03"},
                {"Nationalist Movement in Andhra", "ఆంధ్రలో జాతీయోద్యమం", "HIST-AP-04"},
                {"Andhra Movement & State Formation", "ఆంధ్ర ఉద్యమం & రాష్ట్ర ఏర్పాటు", "HIST-AP-05"},
        });

        // ════════════════════════════════════════
        // SUBJECT 2: Geography
        // ════════════════════════════════════════
        SubCategory geography = subCategoryRepository.save(SubCategory.builder()
                .name("Geography")
                .nameTe("భూగోళశాస్త్రం")
                .description("Physical, Economic, and AP Geography.")
                .descriptionTe("భౌతిక, ఆర్థిక మరియు AP భూగోళశాస్త్రం.")
                .syllabusCode("GEO")
                .category(g1)
                .build());

        Section physicalGeo = sectionRepository.save(Section.builder()
                .name("General & Physical Geography")
                .nameTe("సాధారణ & భౌతిక భూగోళశాస్త్రం")
                .sectionCode("GEO-PHY")
                .subCategory(geography)
                .build());

        seedTopics(physicalGeo, new String[][]{
                {"Physical Geography of India", "భారతదేశ భౌతిక భూగోళశాస్త్రం", "GEO-PHY-01"},
                {"Climate & Monsoons", "వాతావరణం & రుతుపవనాలు", "GEO-PHY-02"},
                {"Rivers & Drainage Systems", "నదులు & పారుదల వ్యవస్థలు", "GEO-PHY-03"},
                {"Soils & Natural Vegetation", "నేలలు & సహజ వృక్షసంపద", "GEO-PHY-04"},
        });

        Section econGeo = sectionRepository.save(Section.builder()
                .name("Economic Geography")
                .nameTe("ఆర్థిక భూగోళశాస్త్రం")
                .sectionCode("GEO-ECO")
                .subCategory(geography)
                .build());

        seedTopics(econGeo, new String[][]{
                {"Resources & Industries", "వనరులు & పరిశ్రమలు", "GEO-ECO-01"},
                {"Agriculture & Land Use", "వ్యవసాయం & భూ వినియోగం", "GEO-ECO-02"},
                {"Fauna and Flora of India & AP", "భారతదేశం & AP జంతుజాలం మరియు వృక్షజాలం", "GEO-ECO-03"},
        });

        // ════════════════════════════════════════
        // SUBJECT 3: Polity & Governance
        // ════════════════════════════════════════
        SubCategory polity = subCategoryRepository.save(SubCategory.builder()
                .name("Polity & Governance")
                .nameTe("రాజకీయ శాస్త్రం & పాలన")
                .description("Indian Constitution, Governance, Ethics & Law.")
                .descriptionTe("భారత రాజ్యాంగం, పాలన, నైతికత & చట్టం.")
                .syllabusCode("POL")
                .category(g1)
                .build());

        Section constitution = sectionRepository.save(Section.builder()
                .name("Indian Constitution")
                .nameTe("భారత రాజ్యాంగం")
                .sectionCode("POL-CON")
                .subCategory(polity)
                .build());

        seedTopics(constitution, new String[][]{
                {"Constitutional Evolution & Salient Features", "రాజ్యాంగ పరిణామం & ముఖ్య లక్షణాలు", "POL-CON-01"},
                {"Fundamental Rights", "ప్రాథమిక హక్కులు", "POL-CON-02"},
                {"Directive Principles & Fundamental Duties", "ఆదేశిక సూత్రాలు & ప్రాథమిక విధులు", "POL-CON-03"},
                {"Union & State Government", "కేంద్ర & రాష్ట్ర ప్రభుత్వం", "POL-CON-04"},
                {"Federal Structure & Center-State Relations", "సమాఖ్య నిర్మాణం & కేంద్ర-రాష్ట్ర సంబంధాలు", "POL-CON-05"},
                {"Constitutional & Statutory Bodies", "రాజ్యాంగ & చట్టబద్ధ సంస్థలు", "POL-CON-06"},
                {"Elections & Rights Issues", "ఎన్నికలు & హక్కుల సమస్యలు", "POL-CON-07"},
                {"Local Self-Government (Panchayati Raj)", "స్థానిక స్వపరిపాలన (పంచాయతీ రాజ్)", "POL-CON-08"},
        });

        Section ethics = sectionRepository.save(Section.builder()
                .name("Ethics & Public Administration")
                .nameTe("నైతికత & ప్రజా పరిపాలన")
                .sectionCode("POL-ETH")
                .subCategory(polity)
                .build());

        seedTopics(ethics, new String[][]{
                {"Ethics & Human Interface", "నైతికత & మానవ ఇంటర్‌ఫేస్", "POL-ETH-01"},
                {"Human Values", "మానవ విలువలు", "POL-ETH-02"},
                {"Attitude", "వైఖరి", "POL-ETH-03"},
                {"Professional Ethics in Governance", "పాలనలో వృత్తిపరమైన నైతికత", "POL-ETH-04"},
                {"Basic Knowledge of Laws", "చట్టాల ప్రాథమిక జ్ఞానం", "POL-ETH-05"},
                {"E-Governance", "ఇ-గవర్నెన్స్", "POL-ETH-06"},
        });

        // ════════════════════════════════════════
        // SUBJECT 4: Economy
        // ════════════════════════════════════════
        SubCategory economy = subCategoryRepository.save(SubCategory.builder()
                .name("Economy")
                .nameTe("ఆర్థిక వ్యవస్థ")
                .description("Indian Economy, AP Economy, and Economic Development.")
                .descriptionTe("భారత ఆర్థిక వ్యవస్థ, AP ఆర్థిక వ్యవస్థ మరియు ఆర్థికాభివృద్ధి.")
                .syllabusCode("ECON")
                .category(g1)
                .build());

        Section indianEcon = sectionRepository.save(Section.builder()
                .name("Indian Economy")
                .nameTe("భారత ఆర్థిక వ్యవస్థ")
                .sectionCode("ECON-IND")
                .subCategory(economy)
                .build());

        seedTopics(indianEcon, new String[][]{
                {"Basic Characteristics & Economic Planning", "ప్రాథమిక లక్షణాలు & ఆర్థిక ప్రణాళిక", "ECON-IND-01"},
                {"Poverty, Unemployment & Inequality", "పేదరికం, నిరుద్యోగం & అసమానత", "ECON-IND-02"},
                {"Money, Banking & Public Finance", "డబ్బు, బ్యాంకింగ్ & ప్రజా ఆర్థిక", "ECON-IND-03"},
                {"Government Budgeting & Union Budget", "ప్రభుత్వ బడ్జెట్ & కేంద్ర బడ్జెట్", "ECON-IND-04"},
                {"Inclusive Growth", "సమ్మిళిత వృద్ధి", "ECON-IND-05"},
                {"Agriculture", "వ్యవసాయం", "ECON-IND-06"},
                {"Indian Industry", "భారత పరిశ్రమ", "ECON-IND-07"},
                {"Infrastructure", "మౌలిక సదుపాయాలు", "ECON-IND-08"},
        });

        Section apEcon = sectionRepository.save(Section.builder()
                .name("AP Economy")
                .nameTe("AP ఆర్థిక వ్యవస్థ")
                .sectionCode("ECON-AP")
                .subCategory(economy)
                .build());

        seedTopics(apEcon, new String[][]{
                {"AP Economy (Post-Bifurcation)", "AP ఆర్థిక వ్యవస్థ (విభజన అనంతరం)", "ECON-AP-01"},
                {"AP Budget", "AP బడ్జెట్", "ECON-AP-02"},
                {"AP Agriculture", "AP వ్యవసాయం", "ECON-AP-03"},
                {"AP Industry", "AP పరిశ్రమ", "ECON-AP-04"},
                {"AP Infrastructure", "AP మౌలిక సదుపాయాలు", "ECON-AP-05"},
        });

        // ════════════════════════════════════════
        // SUBJECT 5: Science & Technology
        // ════════════════════════════════════════
        SubCategory science = subCategoryRepository.save(SubCategory.builder()
                .name("Science & Technology")
                .nameTe("సైన్స్ & టెక్నాలజీ")
                .description("Science, Technology, and Environmental Issues.")
                .descriptionTe("సైన్స్, టెక్నాలజీ మరియు పర్యావరణ సమస్యలు.")
                .syllabusCode("SCI")
                .category(g1)
                .build());

        Section sciTech = sectionRepository.save(Section.builder()
                .name("Science & Technology")
                .nameTe("సైన్స్ & టెక్నాలజీ")
                .sectionCode("SCI-TECH")
                .subCategory(science)
                .build());

        seedTopics(sciTech, new String[][]{
                {"S&T Policy & Institutions", "S&T విధానం & సంస్థలు", "SCI-TECH-01"},
                {"ICT & Digital India", "ICT & డిజిటల్ ఇండియా", "SCI-TECH-02"},
                {"Space & Defence Technology", "అంతరిక్ష & రక్షణ సాంకేతికత", "SCI-TECH-03"},
                {"Energy", "ఇంధనం", "SCI-TECH-04"},
                {"Biotechnology & Genetic Engineering", "బయోటెక్నాలజీ & జెనెటిక్ ఇంజనీరింగ్", "SCI-TECH-05"},
                {"Human Diseases", "మానవ వ్యాధులు", "SCI-TECH-06"},
                {"Intellectual Property Rights", "మేధో సంపత్తి హక్కులు", "SCI-TECH-07"},
        });

        Section environment = sectionRepository.save(Section.builder()
                .name("Environment")
                .nameTe("పర్యావరణం")
                .sectionCode("SCI-ENV")
                .subCategory(science)
                .build());

        seedTopics(environment, new String[][]{
                {"Environment & Ecology", "పర్యావరణం & జీవావరణ శాస్త్రం", "SCI-ENV-01"},
                {"Climate Change", "వాతావరణ మార్పు", "SCI-ENV-02"},
        });

        // ════════════════════════════════════════
        // SUBJECT 6: Current Affairs & Aptitude (Prelims)
        // ════════════════════════════════════════
        SubCategory currentAffairs = subCategoryRepository.save(SubCategory.builder()
                .name("Current Affairs & Aptitude")
                .nameTe("ప్రస్తుత వ్యవహారాలు & ఆప్టిట్యూడ్")
                .description("Current Events, Logical Reasoning, Mental Ability — Prelims Paper-II.")
                .descriptionTe("ప్రస్తుత సంఘటనలు, తార్కిక వివేచన, మానసిక సామర్థ్యం.")
                .syllabusCode("CA")
                .category(g1)
                .build());

        Section aptitude = sectionRepository.save(Section.builder()
                .name("Aptitude & Mental Ability")
                .nameTe("ఆప్టిట్యూడ్ & మానసిక సామర్థ్యం")
                .sectionCode("CA-APT")
                .subCategory(currentAffairs)
                .build());

        seedTopics(aptitude, new String[][]{
                {"Logical Reasoning & Mental Ability", "తార్కిక వివేచన & మానసిక సామర్థ్యం", "CA-APT-01"},
                {"Basic Numeracy & Data Interpretation", "ప్రాథమిక సంఖ్యాశాస్త్రం & డేటా వివరణ", "CA-APT-02"},
                {"Emotional & Social Intelligence", "భావోద్వేగ & సామాజిక మేధస్సు", "CA-APT-03"},
        });

        Section currentEvents = sectionRepository.save(Section.builder()
                .name("Current Events")
                .nameTe("ప్రస్తుత సంఘటనలు")
                .sectionCode("CA-CUR")
                .subCategory(currentAffairs)
                .build());

        seedTopics(currentEvents, new String[][]{
                {"National & International Current Events", "జాతీయ & అంతర్జాతీయ ప్రస్తుత సంఘటనలు", "CA-CUR-01"},
        });

        System.out.println("  -> History & Culture: 4 sections, 24 topics");
        System.out.println("  -> Geography: 2 sections, 7 topics");
        System.out.println("  -> Polity & Governance: 2 sections, 14 topics");
        System.out.println("  -> Economy: 2 sections, 13 topics");
        System.out.println("  -> Science & Technology: 2 sections, 9 topics");
        System.out.println("  -> Current Affairs & Aptitude: 2 sections, 4 topics");
    }

    private void seedTopics(Section section, String[][] topics) {
        int displayOrder = 1;
        for (String[] t : topics) {
            topicRepository.save(Topic.builder()
                    .name(t[0])
                    .nameTe(t[1])
                    .topicCode(t[2])
                    .section(section)
                    .displayOrder(displayOrder++)
                    .isPublished(true)
                    .build());
        }
    }
}
