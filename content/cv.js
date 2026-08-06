/**
 * CV CONTENT UPDATE GUIDE
 *
 * Copy an existing object in the relevant array, paste it in display order,
 * and replace its values. Keep `sortDate` in YYYY or YYYY-MM format.
 * Use plain text; paths may be relative to index.html.
 *
 * Schemas:
 * experience: { sortDate, date, organization, role, location?, logo?, mark?, bullets?: [], tags?: [] }
 * projects: { title, summary, context?, image?, imageAlt?, imageSource?, imageSourceLabel?, figureCaption?, metrics?: [{ value, label }], links?: [{ label, url }] }
 * publications: { year, title, authors, venue, url? }
 * education: { sortDate, date, degree, school, location?, gpa?, honor?, details?, logo? }
 * awards: { year, title, description?, url? }
 * service: { title, description?, links?: [{ label, url }] }
 *
 * Optional presentation fields used below: logoWidth, logoHeight, logoClass,
 * markClass, mark, and bulletLinks.
 */

window.PORTFOLIO_CV = {
  experience: [
    {
      sortDate: "2026-05",
      date: "May 2026 - Aug 2026",
      location: "San Jose, California",
      organization: "eBay",
      role: "Software Engineer Intern",
      logo: "images/ebay-logo.png",
      logoWidth: 738,
      logoHeight: 414,
      logoClass: "company-logo-wide",
      bullets: [
        "Built an end-to-end ML system for the NuBlox platform using Python, Prometheus/PromQL, and CatBoost to forecast PVCs likely to exceed 90% utilization within 14 days.",
        "Developed a hotspot-analysis pipeline across latency, I/O, memory, and capacity signals to identify imbalanced nodes and recommend workload rebalancing, reducing hotspot-related latency and improving storage efficiency.",
        "Deployed a 34-endpoint FastAPI service with Docker and Kubernetes, automating four daily CronJobs for mapping, forecasting, reporting, and Slack alerts and cutting manual monitoring time by half."
      ],
      tags: ["Python", "FastAPI", "PromQL", "CatBoost", "Kubernetes"]
    },
    {
      sortDate: "2023-08",
      date: "Aug 2023 - Present",
      location: "Stillwater, Oklahoma",
      organization: "rAIson (Reasoning & AI Laboratory), Oklahoma State University",
      role: "Graduate Research Assistant",
      logo: "images/OSU.png",
      logoWidth: 108,
      logoHeight: 56,
      bullets: [
        "Spearheaded multimodal-learning research and developed G²D with PyTorch to mitigate modality imbalance, resulting in a first-author ICCV 2025 publication.",
        "Engineered MIS-ME, a multimodal fusion model for soil-moisture estimation that reduced prediction error by more than 3% and led to a first-author DSAA 2024 publication.",
        "Research spans knowledge distillation, computer vision, precision agriculture, and physics-guided learning."
      ],
      tags: ["PyTorch", "Multimodal AI", "Knowledge distillation"]
    },
    {
      sortDate: "2023-08",
      date: "Aug 2023 - Present",
      location: "Stillwater, Oklahoma",
      organization: "Department of Computer Science, OSU",
      role: "Graduate Teaching Assistant",
      logo: "images/OSU.png",
      logoWidth: 108,
      logoHeight: 56,
      bullets: [
        "Lead labs, grade assignments, review code, mentor students one-on-one, and support course websites and Canvas.",
        "Courses include Operating Systems I, Object-Oriented Programming, Database Systems, and Discrete Mathematics, using C++, Java, MySQL, and shell scripting."
      ],
      tags: ["Teaching", "C++", "Java", "Databases"]
    },
    {
      sortDate: "2022-06",
      date: "Jun 2022 - Jul 2023",
      location: "Dhaka, Bangladesh",
      organization: "Neovo Tech Ltd.",
      role: "ML Intern → Data Scientist & ML Engineer",
      logo: "images/Neovotech.jpeg",
      logoWidth: 64,
      logoHeight: 64,
      logoClass: "company-logo-square",
      bullets: [
        "Built a distributed Celery and RabbitMQ web-crawling system for fintech client Eucaps, containerized with Docker, orchestrated on Kubernetes, and connected to downstream financial-news analytics.",
        "Engineered a Hugging Face neural machine translation pipeline with Docker and AWS S3 for multilingual financial updates.",
        "Co-developed more than 30 FastAPI endpoints for authentication, scheduling, and Stripe payments in a booking platform."
      ],
      tags: ["FastAPI", "Celery", "RabbitMQ", "AWS"]
    },
    {
      sortDate: "2021-09",
      date: "Sep 2021 - Sep 2022",
      location: "Dhaka, Bangladesh",
      organization: "Apurba-NSU R&D Lab",
      role: "Research Assistant",
      logo: "images/ApurbaLab.jpeg",
      logoWidth: 64,
      logoHeight: 64,
      logoClass: "company-logo-square",
      bullets: [
        "Developed and deployed deep-learning models for NLP, QA, NER, ASR, OCR, and computer vision, contributing to publications at ICPR 2022 and ICLR 2023.",
        "Researched pruning, quantization, and knowledge distillation; created the COLT iterative pruning algorithm published in IEEE Transactions on Artificial Intelligence.",
        "Conducted this research with Dr. Nabeel Mohammed and the Apurba-NSU research team."
      ],
      bulletLinks: [
        {
          bulletIndex: 2,
          label: "Dr. Nabeel Mohammed",
          url: "http://ece.northsouth.edu/people/dr-nabeel-mohammed/"
        }
      ],
      tags: ["NLP", "Computer vision", "Model compression"]
    }
  ],

  projects: [
    {
      title: "PhyGHT: Physics-Guided HyperGraph Transformer for Signal Purification at the HL-LHC",
      context: "KDD 2026",
      summary: "Designed a physics-guided hypergraph transformer for pileup mitigation, reaching R² = 0.932 for energy and R² = 0.836 for mass correction under extreme pileup.",
      metrics: [
        { value: "40.4 ms", label: "latency" },
        { value: "8.7×", label: "faster than ParticleNet" }
      ],
      image: "images/projects/phyght-architecture.png",
      imageAlt: "PhyGHT model architecture for physics-guided particle pileup mitigation",
      imageSource: "https://arxiv.org/abs/2602.20475",
      figureCaption: "PhyGHT architecture",
      links: [{ label: "View project", url: "https://github.com/rAIson-Lab/PhyGHT" }]
    },
    {
      title: "G²D: Boosting Multimodal Learning with Gradient-Guided Distillation",
      context: "ICCV 2025",
      summary: "Created an open-source knowledge-distillation framework and Sequential Modality Prioritization technique to counter modality imbalance.",
      metrics: [
        { value: "18%+", label: "accuracy gain" },
        { value: "0.5%", label: "memory overhead" }
      ],
      image: "images/projects/g2d-architecture.png",
      imageAlt: "G squared D gradient-guided distillation architecture for multimodal learning",
      imageSource: "https://arxiv.org/abs/2506.21514",
      figureCaption: "G²D architecture",
      links: [{ label: "View project", url: "https://github.com/rAIson-Lab/G2D" }]
    },
    {
      title: "MIS-ME: A Multi-modal Framework for Soil Moisture Estimation",
      context: "DSAA 2024",
      summary: "Fused soil-patch imagery with meteorological data, reducing MAPE by 3.25% over meteorological-only models, 2.15% over image-only models, and at least 1.5% over conventional fusion.",
      metrics: [],
      image: "images/projects/mis-me-architecture.png",
      imageAlt: "MIS-ME multimodal architecture combining soil images and meteorological data",
      imageSource: "https://arxiv.org/abs/2408.00963",
      figureCaption: "MIS-ME multimodal architecture",
      links: [{ label: "Read the paper", url: "https://ieeexplore.ieee.org/abstract/document/10722779" }]
    },
    {
      title: "Bangla-Wave: Improving Bangla Automatic Speech Recognition Utilizing N-gram Language Models",
      context: "ICSCA 2023",
      summary: "Fine-tuned wav2vec 2.0 on 399 hours of Bengali speech and added an n-gram post-processor, achieving 4.66% WER and 1.54% CER.",
      metrics: [],
      image: "images/projects/bangla-wave-architecture.png",
      imageAlt: "Bangla-Wave speech recognition and language-model correction pipeline",
      imageSource: "https://arxiv.org/abs/2209.12650",
      figureCaption: "Bangla-Wave pipeline",
      links: [{ label: "Read the paper", url: "https://arxiv.org/abs/2209.12650" }]
    },
    {
      title: "An Open Source Contractual Language Understanding Application Using Machine Learning",
      context: "Open source",
      summary: "Co-led an end-to-end legal-contract review application, improving RoBERTa-base AUPR by 4% and reaching 20K monthly model downloads.",
      metrics: [],
      image: "images/projects/contract-system-diagram.png",
      imageAlt: "System diagram for the contract-language review application from document upload to highlighted clauses",
      imageSource: "https://aclanthology.org/2022.lateraisse-1.6/",
      figureCaption: "Contract-review system",
      links: [{ label: "View project", url: "https://github.com/afra-tech/defactolaw" }]
    },
    {
      title: "Distributed k-NN with Hadoop MapReduce",
      context: "Distributed systems",
      summary: "Engineered a distributed k-NN classifier from scratch with a memory-efficient priority-queue reducer and benchmarked it on single- and multi-node Hadoop clusters.",
      metrics: [],
      image: "images/projects/hadoop-knn-mapreduce.png",
      imageAlt: "Distributed k-NN pipeline using HDFS data blocks, parallel Hadoop mappers, a global top-k reducer, and majority-vote prediction",
      figureCaption: "Distributed k-NN MapReduce pipeline",
      links: []
    },
    {
      title: "PUMiNet: PileUp Mitigation at the HL-LHC Using Attention for Event-Wide Context",
      context: "PAKDD 2025",
      summary: "Event-wide attention for HL-LHC pileup mitigation; R² of 0.912 for energy fraction and 0.720 for mass fraction, enabling improved Higgs-boson mass reconstruction.",
      metrics: [],
      image: "images/projects/puminet-architecture.png",
      imageAlt: "PUMiNet neural network architecture for event-wide pileup mitigation",
      imageSource: "https://arxiv.org/abs/2503.02860",
      figureCaption: "PUMiNet architecture",
      links: [{ label: "Paper", url: "https://arxiv.org/abs/2503.02860" }]
    },
    {
      title: "Exploiting Adaptive Contextual Masking for Aspect-Based Sentiment Analysis",
      context: "PAKDD 2024",
      summary: "Gradient-learned masking for aspect term extraction and sentiment classification that outperformed comparison methods on SemEval benchmarks.",
      metrics: [],
      image: "images/projects/adaptive-contextual-masking.png",
      imageAlt: "Adaptive contextual masking threshold strategy for aspect-based sentiment analysis",
      imageSource: "https://arxiv.org/abs/2402.13722",
      figureCaption: "Adaptive masking strategy",
      links: [{ label: "Paper", url: "https://doi.org/10.1007/978-981-97-2266-2_12" }]
    },
    {
      title: "COLT: Cyclic Overlapping Lottery Tickets for Faster Pruning of Convolutional Neural Networks",
      context: "IEEE TAI 2025",
      summary: "Class-wise overlapping lottery tickets that required fewer pruning iterations than IMP and transferred across datasets without performance loss.",
      metrics: [],
      image: "images/projects/colt-method.png",
      imageAlt: "COLT cyclic overlapping lottery ticket pruning method",
      imageSource: "https://arxiv.org/abs/2212.12770",
      figureCaption: "COLT pruning method",
      links: [{ label: "Paper", url: "https://ieeexplore.ieee.org/abstract/document/10855806" }]
    },
    {
      title: "LILA-BOTI: Leveraging Isolated Letter Accumulations by Ordering Teacher Insights for Bangla Handwriting Recognition",
      context: "ICPR 2022",
      summary: "Knowledge distillation for Bangla handwriting recognition, improving minor-class F1-Macro by up to 3.5% and overall word recognition by up to 4%.",
      metrics: [],
      image: "images/projects/lila-boti-architecture.png",
      imageAlt: "LILA-BOTI teacher-student knowledge-distillation pipeline for Bangla handwriting recognition",
      imageSource: "https://arxiv.org/abs/2205.11420",
      figureCaption: "LILA-BOTI training pipeline",
      links: [{ label: "Paper", url: "https://doi.org/10.1109/ICPR56361.2022.9956141" }]
    },
    {
      title: "Water Level Forecasting Using Spatiotemporal Attention-Based Long Short-Term Memory Network",
      context: "Water 2022",
      summary: "Spatiotemporal attention LSTM for river forecasting in Bangladesh, improving Dhaka-station accuracy by 3.44%.",
      metrics: [],
      image: "images/projects/water-level-architecture.png",
      imageAlt: "Spatiotemporal attention LSTM architecture for water-level forecasting",
      imageSource: "https://doi.org/10.3390/w14040612",
      figureCaption: "Spatiotemporal attention LSTM",
      links: [{ label: "Paper", url: "https://doi.org/10.3390/w14040612" }]
    },
    {
      title: "IoT-Based Air Pollution Monitoring & Prediction System",
      context: "ICISET 2022",
      summary: "Led a team of three building a sensor-to-cloud system and ARIMA model using 144 hourly observations for next-day forecasts with over 90% reported accuracy.",
      metrics: [],
      image: "images/projects/iot-air-quality-system.png",
      imageAlt: "Arduino Mega wiring diagram for the IoT air-quality system with dust, ammonia, carbon monoxide, temperature, humidity, and Wi-Fi sensors",
      imageSource: "https://doi.org/10.1109/ICISET54810.2022.9775871",
      figureCaption: "IoT sensor wiring diagram",
      links: [{ label: "Paper", url: "https://doi.org/10.1109/ICISET54810.2022.9775871" }]
    },
    {
      title: "My Reading Room",
      context: "Open source",
      summary: "Django learning platform with document sharing, reading-time tracking, and OpenCV-based engagement monitoring.",
      metrics: [],
      image: "images/projects/my-reading-room-use-case.png",
      imageAlt: "My Reading Room use-case diagram showing teacher and student features for classes, reading materials, face detection, and reading analytics",
      imageSource: "https://github.com/MohammedRakib/My-Reading-Room",
      imageSourceLabel: "Repository",
      figureCaption: "Reading Room use-case diagram",
      links: []
    },
    {
      title: "AgeDB Age Estimation",
      context: "Computer vision",
      summary: "Fine-tuned ResNet-152 with CORAL loss to 9.07-year MAE versus the cited DEX result of 13.1, using 20× fewer samples; CORAL outperformed cross-entropy.",
      metrics: [],
      image: "images/projects/agedb-age-estimation.png",
      imageAlt: "CORAL age-estimation architecture with a ResNet backbone, extended ordinal labels, and weight-shared binary tasks",
      imageSource: "https://github.com/MohammedRakib/Age-Classification",
      imageSourceLabel: "Repository",
      figureCaption: "CORAL age-estimation architecture",
      links: []
    }
  ],

  publications: [
    {
      year: "2026",
      title: "PhyGHT: Physics-Guided HyperGraph Transformer for Signal Purification at the HL-LHC",
      authors: "M. Rakib et al.",
      venue: "KDD 2026, AI4Sciences Track",
      url: "https://github.com/rAIson-Lab/PhyGHT"
    },
    {
      year: "2025",
      title: "G²D: Boosting Multimodal Learning with Gradient-Guided Distillation",
      authors: "M. Rakib et al.",
      venue: "ICCV 2025",
      url: "https://github.com/rAIson-Lab/G2D"
    },
    {
      year: "2025",
      title: "PileUp Mitigation at the HL-LHC Using Attention for Event-Wide Context",
      authors: "L. Vaughan, M. Rakib, S. Patel, F. Rizatdinova, A. Khanov, and A. Bagavathi",
      venue: "PAKDD 2025",
      url: "https://arxiv.org/abs/2503.02860"
    },
    {
      year: "2025",
      title: "COLT: Cyclic Overlapping Lottery Tickets for Faster Pruning of Convolutional Neural Networks",
      authors: "M. I. Hossain, M. Rakib, M. M. L. Elahi, N. Mohammed, and S. Rahman",
      venue: "IEEE Transactions on Artificial Intelligence",
      url: "https://ieeexplore.ieee.org/abstract/document/10855806"
    },
    {
      year: "2024",
      title: "MIS-ME: A Multi-modal Framework for Soil Moisture Estimation",
      authors: "M. Rakib, A. A. Mohammed, C. Diggins, S. Sharma, J. M. Sadler, T. Ochsner, and A. Bagavathi",
      venue: "DSAA 2024",
      url: "https://ieeexplore.ieee.org/abstract/document/10722779"
    },
    {
      year: "2024",
      title: "Exploiting Adaptive Contextual Masking for Aspect-Based Sentiment Analysis",
      authors: "S. M. Rafiuddin, M. Rakib, S. Kamal, and A. Bagavathi",
      venue: "PAKDD 2024",
      url: "https://doi.org/10.1007/978-981-97-2266-2_12"
    },
    {
      year: "2023",
      title: "Bangla-Wave: Improving Bangla Automatic Speech Recognition Utilizing N-gram Language Models",
      authors: "M. Rakib, M. I. Hossain, N. Mohammed, and F. Rahman",
      venue: "ICSCA 2023",
      url: "https://doi.org/10.1145/3587828.3587872"
    },
    {
      year: "2023",
      title: "Automated Mapping of Healthcare Concepts to a Standardized Healthcare Taxonomy",
      authors: "S. Mollah, M. Rakib, M. Wasek, A. S. A. Rabby, F. Rahman, and N. Mohammed",
      venue: "ICLR Tiny Papers 2023",
      url: "https://openreview.net/forum?id=87oCobKKS6x"
    },
    {
      year: "2022",
      title: "LILA-BOTI: Leveraging Isolated Letter Accumulations by Ordering Teacher Insights for Bangla Handwriting Recognition",
      authors: "M. I. Hossain, M. Rakib, S. Mollah, F. Rahman, and N. Mohammed",
      venue: "ICPR 2022",
      url: "https://doi.org/10.1109/ICPR56361.2022.9956141"
    },
    {
      year: "2022",
      title: "An Open Source Contractual Language Understanding Application Using Machine Learning",
      authors: "A. Nawar, M. Rakib, S. A. Hai, and S. Haq",
      venue: "LREC Workshop 2022",
      url: "https://aclanthology.org/2022.lateraisse-1.6"
    },
    {
      year: "2022",
      title: "IoT-Based Air Pollution Monitoring & Prediction System",
      authors: "M. Rakib, S. Haq, M. I. Hossain, and T. Rahman",
      venue: "ICISET 2022",
      url: "https://doi.org/10.1109/ICISET54810.2022.9775871"
    },
    {
      year: "2022",
      title: "Water Level Forecasting Using Spatiotemporal Attention-Based Long Short-Term Memory Network",
      authors: "F. Noor, S. Haq, M. Rakib et al.",
      venue: "Water 14(4), 612",
      url: "https://doi.org/10.3390/w14040612"
    }
  ],

  education: [
    {
      sortDate: "2023",
      date: "2023 - Present",
      degree: "PhD, Computer Science",
      school: "Oklahoma State University",
      location: "Stillwater, Oklahoma",
      gpa: "3.88",
      logo: "images/OSU.png",
      logoWidth: 112,
      logoHeight: 58
    },
    {
      sortDate: "2023",
      date: "2023 - May 2026",
      degree: "MS, Computer Science",
      school: "Oklahoma State University",
      location: "Stillwater, Oklahoma",
      gpa: "3.82",
      details: "Big Data Analytics; Cloud Computing & Distributed Systems; Data Structure & Algorithms II; Database Systems",
      logo: "images/OSU.png",
      logoWidth: 112,
      logoHeight: 58
    },
    {
      sortDate: "2017-09",
      date: "Sep 2017 - Sep 2021",
      degree: "BS, Computer Science & Engineering",
      school: "North South University",
      location: "Dhaka, Bangladesh",
      gpa: "3.96",
      honor: "Summa Cum Laude",
      logo: "images/NSU.png",
      logoWidth: 72,
      logoHeight: 86,
      logoClass: "education-logo-nsu"
    }
  ],

  awards: [
    {
      year: "2026",
      title: "Google Cloud Research Credits",
      description: "$1,000 award supporting research computing."
    },
    {
      year: "2024",
      title: "OSU Graduate College Student Travel Award",
      description: "$400 award supporting research dissemination."
    },
    {
      year: "2022",
      title: "Bengali ASR Competition Runner-up",
      description: "DL Sprint, BUET CSE Fest."
    },
    {
      year: "2021",
      title: "Summa Cum Laude",
      description: "Graduated from NSU with a 3.96 GPA."
    },
    {
      year: "2021",
      title: "5th place, Project Showcasing",
      description: "MIST ICT Innovation Fest."
    },
    {
      year: "2017",
      title: "Academic Excellence Award",
      description: "75% scholarship for the CSE bachelor’s degree at NSU."
    }
  ],

  service: [
    {
      mark: "R",
      title: "Peer reviewer",
      description: "BMVC 2026, CVPR 2025, ICCV 2025, and IJCNN 2024."
    },
    {
      mark: "W",
      title: "Workshop leader",
      description: "Led an OSU DataBytes workshop on multimodal learning and hands-on PyTorch and deep-learning workshops at NSU."
    },
    {
      mark: "M",
      title: "Student mentor",
      description: "Mentored teams at the OSU ACM Appathon 2025.",
      links: [{ label: "OSU ACM Appathon 2025", url: "images/Mentor-certificate.png" }]
    },
    {
      mark: "V",
      title: "Volunteer",
      description: "Supported fundraising for SCARS to assist underprivileged communities."
    }
  ]
};
