// SPDX-License-Identifier: Apache-2.0
export type Language = 'en' | 'es'

type Translations = Record<Language, Record<string, string>>

export const translations: Translations = {
  en: {
    // --- TranslationWidget ---
    langEn: 'EN',
    langEs: 'ES',

    // --- Hero ---
    heroTitle: 'Association Rules & Sequence Mining',
    heroSubtitle: 'Discover hidden patterns in transactional data. Learn how Apriori, FP-Growth, and sequence mining algorithms reveal meaningful co-occurrence relationships and temporal patterns.',

    // --- Theory ---
    theoryTitle: 'Core Concepts',
    theorySubtitle: 'Four pillars of frequent pattern mining',

    theoryCard1Title: 'Apriori Algorithm',
    theoryCard1Desc: 'The classic breadth-first algorithm for mining frequent itemsets. Uses the anti-monotone property to prune the search space efficiently.',
    theoryCard1Point1: 'Generate candidate k-itemsets from frequent (k-1)-itemsets',
    theoryCard1Point2: 'Prune candidates containing infrequent subsets',
    theoryCard1Point3: 'Multiple database scans — simple but I/O intensive',
    theoryCard1Point4: 'Foundation for all association rule mining',

    theoryCard2Title: 'FP-Growth',
    theoryCard2Desc: 'Faster tree-based approach that compresses the database into an FP-Tree, avoiding costly candidate generation entirely.',
    theoryCard2Point1: 'Only two database scans required',
    theoryCard2Point2: 'Compact FP-Tree structure for in-memory mining',
    theoryCard2Point3: 'Divide-and-conquer via conditional pattern bases',
    theoryCard2Point4: '10–100x faster than Apriori on large datasets',

    theoryCard3Title: 'Key Metrics',
    theoryCard3Desc: 'Three fundamental measures that define the quality and interestingness of discovered association rules.',
    theoryCard3Point1: 'Support: frequency of itemset in all transactions',
    theoryCard3Point2: 'Confidence: P(B|A) — how often rule holds',
    theoryCard3Point3: 'Lift: ratio of observed to expected confidence',
    theoryCard3Point4: 'Lift > 1 indicates a positive association',

    theoryCard4Title: 'Sequence Mining',
    theoryCard4Desc: 'Extends association rules to ordered temporal patterns. Finds frequent subsequences in event logs, clickstreams, and purchase histories.',
    theoryCard4Point1: 'GSP: Generalized Sequential Patterns (Apriori-based)',
    theoryCard4Point2: 'PrefixSpan: Prefix-projected pattern growth',
    theoryCard4Point3: 'SPADE: Vertical data format for efficiency',
    theoryCard4Point4: 'Applications: web sessions, medical events, text mining',

    // --- Preprocessing ---
    prepTitle: 'Data Preprocessing',
    prepSubtitle: 'From raw data to transaction format',
    prepStep1Title: 'Raw Data',
    prepStep1Desc: 'Each row is a transaction (receipt, session, order). Items can be products, pages visited, symptoms, or any categorical events.',
    prepStep2Title: 'Transaction Format',
    prepStep2Desc: 'Group items by transaction ID. Each transaction becomes a set of items. Order within a transaction does not matter for rules (but does for sequences).',
    prepStep3Title: 'Binary Matrix',
    prepStep3Desc: 'One-hot encode items as columns. Each cell is 1 if the item appears in the transaction. This representation reveals co-occurrence patterns.',
    prepStep4Title: 'Set Thresholds',
    prepStep4Desc: 'Choose minimum support to filter rare items and minimum confidence to filter weak rules. Low support = more rules but slower. High support = fewer but more reliable rules.',
    prepNoteTitle: 'Important',
    prepNoteText: 'Data sparsity is the main challenge. Real retail baskets contain 3-5 items from thousands of products. Setting min_support too low causes combinatorial explosion of candidates.',

    // --- Playground ---
    playgroundTitle: 'Interactive Playground',
    playgroundSubtitle: 'Mine association rules from real transaction datasets',
    playgroundDataset: 'Dataset',
    playgroundDatasetGrocery: 'Grocery Store',
    playgroundDatasetOnline: 'Online Retail',
    playgroundDatasetPharma: 'Pharmacy',
    playgroundMinSupport: 'Min Support',
    playgroundMinConfidence: 'Min Confidence',
    playgroundMinLift: 'Min Lift',
    playgroundRunButton: 'Mine Rules',
    playgroundRunning: 'Mining...',
    playgroundResultsTitle: 'Discovered Rules',
    playgroundNoRules: 'No rules found. Try lowering the thresholds.',
    playgroundRulesCount: 'rules found',
    playgroundColAntecedent: 'Antecedent (IF)',
    playgroundColConsequent: 'Consequent (THEN)',
    playgroundColSupport: 'Support',
    playgroundColConfidence: 'Confidence',
    playgroundColLift: 'Lift',
    playgroundChartTitle: 'Rules Map: Support vs Confidence',
    playgroundChartDesc: 'Each point is a rule. Size represents lift value. Hover for details.',
    playgroundFreqTitle: 'Top Frequent Items',
    playgroundTransactions: 'transactions',
    playgroundItems: 'unique items',
    playgroundSortBy: 'Sort by',

    // --- Business Applications ---
    bizTitle: 'Business Applications',
    bizSubtitle: 'Where association rules create real value',

    bizCard1Title: 'Market Basket Analysis',
    bizCard1Desc: 'Supermarkets and retailers analyze millions of receipts to optimize product placement, design promotions, and build recommendation engines.',
    bizCard1Example: 'Classic insight: "Customers who buy diapers also buy beer on Friday evenings"',

    bizCard2Title: 'E-commerce Recommendations',
    bizCard2Desc: '"Customers who bought this also bought..." — Amazon reportedly attributes 35% of revenue to its recommendation engine powered by association mining.',
    bizCard2Example: 'Cross-sell complementary products at checkout to increase basket size',

    bizCard3Title: 'Web Clickstream Analysis',
    bizCard3Desc: 'Sequence mining on navigation logs reveals common user journeys, dropout points, and optimal content ordering for UX improvement.',
    bizCard3Example: 'Find that users who visit /pricing → /features → /testimonials convert at 3x the average rate',

    bizCard4Title: 'Medical & Clinical',
    bizCard4Desc: 'Mine co-occurring diagnoses, drug interactions, and symptom patterns from electronic health records to support clinical decision-making.',
    bizCard4Example: 'Discover that patients with condition A + medication B have 40% higher risk of complication C',

    bizCard5Title: 'Fraud Detection',
    bizCard5Desc: 'Identify unusual combinations of transactions that deviate from normal purchasing patterns, flagging potential fraudulent behavior.',
    bizCard5Example: 'High-value electronics + gift cards + overseas shipping in same session triggers alert',

    bizCard6Title: 'Supply Chain & Inventory',
    bizCard6Desc: 'Predict which products are ordered together to optimize warehouse layout, batch procurement, and delivery routing.',
    bizCard6Example: 'Items frequently co-purchased are stored adjacent to reduce picking time by 25%',

    // --- Case Study ---
    caseTitle: 'Case Study: Grocery Market Basket',
    caseSubtitle: 'Step-by-step analysis of a real grocery dataset',
    caseStep1: 'Load & Explore Data',
    caseStep1Desc: 'The Groceries dataset contains 9,835 transactions from a real German supermarket with 169 unique items. Average basket size: 4.4 items.',
    caseStep2: 'Set Parameters',
    caseStep2Desc: 'Start conservative: support=0.02 (item appears in 2% of transactions), confidence=0.3. This yields a manageable number of rules to interpret.',
    caseStep3: 'Interpret Rules',
    caseStep3Desc: 'Focus on lift > 1.5 to find truly interesting co-occurrences beyond random chance. Lift=2 means items appear together twice as often as expected.',
    caseStep4: 'Business Action',
    caseStep4Desc: 'Translate rules into actions: bundle promotions, shelf adjacency changes, loyalty program offers, or "frequently bought together" widget.',
    caseInsightTitle: 'Key Insights from the Dataset',
    caseInsight1: '{whole milk} → {yogurt}: support=5.9%, confidence=23.4%, lift=1.57 — moderate positive association',
    caseInsight2: '{butter, other vegetables} → {whole milk}: confidence=57.3%, lift=2.24 — strong rule',
    caseInsight3: '{root vegetables, yogurt} → {whole milk}: lift=2.25 — dairy cluster is very coherent',
    caseInsight4: 'Tropical fruit and citrus fruit rarely co-occur despite both being "fruit" — customers specialize',

    // --- Activities ---
    activitiesTitle: 'Activities & Reflection',
    activitiesSubtitle: 'Deepen your understanding through experimentation',
    activity1Title: 'Threshold Sensitivity',
    activity1Desc: 'In the Playground, set min_support=0.01 vs 0.10 for the same dataset. How does the number of rules change? Which threshold gives more actionable insights?',
    activity2Title: 'Lift vs Confidence',
    activity2Desc: 'Find a rule with high confidence but lift ≈ 1. Why is this rule not interesting despite high confidence? What does it tell us about the baseline frequency?',
    activity3Title: 'Dataset Comparison',
    activity3Desc: 'Run the same thresholds on the Grocery, Online Retail, and Pharmacy datasets. What structural differences do you observe? Why do some datasets produce more rules?',
    activity4Title: 'Symmetric Exploration',
    activity4Desc: 'Note that support is symmetric (A∪B = B∪A) but confidence is not. Find two rules {A}→{B} and {B}→{A} and compare their confidence values. What business decision does each support?',
    activity5Title: 'Spurious Rules',
    activity5Desc: 'Can a rule have high support, high confidence, AND lift < 1? If yes, what would it mean? If you find one, explain why a manager might mistakenly act on it.',
    activity6Title: 'Sequence vs Rules',
    activity6Desc: 'Think of a domain where the ORDER of events matters and association rules would give misleading results. How would sequence mining change the analysis?',

    // --- References ---
    referencesTitle: 'References & Resources',
    ref1: 'Agrawal, R. & Srikant, R. (1994). Fast Algorithms for Mining Association Rules. VLDB.',
    ref2: 'Han, J., Pei, J. & Yin, Y. (2000). Mining Frequent Patterns without Candidate Generation. SIGMOD.',
    ref3: 'Tan, P., Steinbach, M. & Kumar, V. — Introduction to Data Mining (Chapter 5)',
    refLink1: 'mlxtend: Association Rules in Python',
    refLink2: 'arules R package documentation',
    refLink3: 'Frequent Pattern Mining — Mining of Massive Datasets (Ch. 6)',
    refLink4: 'Association Rule Visualization — arulesViz',

    // --- Footer ---
    footerCreatedBy: 'Created by',
    footerPortfolio: 'Portfolio',
    footerGithub: 'GitHub',
    footerRights: 'Apache 2.0 License',
  },

  es: {
    // --- TranslationWidget ---
    langEn: 'EN',
    langEs: 'ES',

    // --- Hero ---
    heroTitle: 'Reglas de Asociación y Minería de Secuencias',
    heroSubtitle: 'Descubre patrones ocultos en datos transaccionales. Aprende cómo los algoritmos Apriori, FP-Growth y la minería de secuencias revelan relaciones de co-ocurrencia y patrones temporales.',

    // --- Theory ---
    theoryTitle: 'Conceptos Fundamentales',
    theorySubtitle: 'Cuatro pilares de la minería de patrones frecuentes',

    theoryCard1Title: 'Algoritmo Apriori',
    theoryCard1Desc: 'El algoritmo clásico de búsqueda en amplitud para minar itemsets frecuentes. Usa la propiedad anti-monótona para podar eficientemente el espacio de búsqueda.',
    theoryCard1Point1: 'Genera candidatos k-itemsets desde los (k-1)-itemsets frecuentes',
    theoryCard1Point2: 'Elimina candidatos que contienen subconjuntos infrecuentes',
    theoryCard1Point3: 'Múltiples lecturas de la BD — simple pero costoso en I/O',
    theoryCard1Point4: 'Base de toda la minería de reglas de asociación',

    theoryCard2Title: 'FP-Growth',
    theoryCard2Desc: 'Enfoque más rápido basado en árboles que comprime la base de datos en un FP-Tree, evitando completamente la generación costosa de candidatos.',
    theoryCard2Point1: 'Solo requiere dos lecturas de la base de datos',
    theoryCard2Point2: 'Estructura FP-Tree compacta para minería en memoria',
    theoryCard2Point3: 'Divide y vencerás mediante bases de patrones condicionales',
    theoryCard2Point4: '10–100x más rápido que Apriori en datasets grandes',

    theoryCard3Title: 'Métricas Clave',
    theoryCard3Desc: 'Tres medidas fundamentales que definen la calidad e interés de las reglas de asociación descubiertas.',
    theoryCard3Point1: 'Soporte: frecuencia del itemset en todas las transacciones',
    theoryCard3Point2: 'Confianza: P(B|A) — qué tan frecuentemente se cumple la regla',
    theoryCard3Point3: 'Lift: ratio entre confianza observada y esperada',
    theoryCard3Point4: 'Lift > 1 indica una asociación positiva genuina',

    theoryCard4Title: 'Minería de Secuencias',
    theoryCard4Desc: 'Extiende las reglas de asociación a patrones temporales ordenados. Encuentra subsecuencias frecuentes en logs de eventos, clickstreams e historiales de compra.',
    theoryCard4Point1: 'GSP: Patrones Secuenciales Generalizados (basado en Apriori)',
    theoryCard4Point2: 'PrefixSpan: Crecimiento de patrones proyectados por prefijo',
    theoryCard4Point3: 'SPADE: Formato vertical de datos para mayor eficiencia',
    theoryCard4Point4: 'Aplicaciones: sesiones web, eventos médicos, minería de texto',

    // --- Preprocessing ---
    prepTitle: 'Preprocesamiento de Datos',
    prepSubtitle: 'Desde datos crudos al formato transaccional',
    prepStep1Title: 'Datos Crudos',
    prepStep1Desc: 'Cada fila es una transacción (boleta, sesión, pedido). Los ítems pueden ser productos, páginas visitadas, síntomas o cualquier evento categórico.',
    prepStep2Title: 'Formato Transaccional',
    prepStep2Desc: 'Agrupa ítems por ID de transacción. Cada transacción se convierte en un conjunto de ítems. El orden dentro de la transacción no importa para reglas (sí para secuencias).',
    prepStep3Title: 'Matriz Binaria',
    prepStep3Desc: 'Codifica los ítems como columnas (one-hot). Cada celda es 1 si el ítem aparece en la transacción. Esta representación revela los patrones de co-ocurrencia.',
    prepStep4Title: 'Definir Umbrales',
    prepStep4Desc: 'Elige soporte mínimo para filtrar ítems raros y confianza mínima para filtrar reglas débiles. Soporte bajo = más reglas pero más lento. Soporte alto = menos reglas pero más confiables.',
    prepNoteTitle: 'Importante',
    prepNoteText: 'La dispersión de los datos es el principal desafío. Las boletas reales contienen 3-5 ítems de miles de productos. Un soporte mínimo muy bajo produce una explosión combinatoria de candidatos.',

    // --- Playground ---
    playgroundTitle: 'Playground Interactivo',
    playgroundSubtitle: 'Minea reglas de asociación desde datasets transaccionales reales',
    playgroundDataset: 'Dataset',
    playgroundDatasetGrocery: 'Supermercado',
    playgroundDatasetOnline: 'Retail Online',
    playgroundDatasetPharma: 'Farmacia',
    playgroundMinSupport: 'Soporte Mínimo',
    playgroundMinConfidence: 'Confianza Mínima',
    playgroundMinLift: 'Lift Mínimo',
    playgroundRunButton: 'Minar Reglas',
    playgroundRunning: 'Minando...',
    playgroundResultsTitle: 'Reglas Descubiertas',
    playgroundNoRules: 'No se encontraron reglas. Intenta bajar los umbrales.',
    playgroundRulesCount: 'reglas encontradas',
    playgroundColAntecedent: 'Antecedente (SI)',
    playgroundColConsequent: 'Consecuente (ENTONCES)',
    playgroundColSupport: 'Soporte',
    playgroundColConfidence: 'Confianza',
    playgroundColLift: 'Lift',
    playgroundChartTitle: 'Mapa de Reglas: Soporte vs Confianza',
    playgroundChartDesc: 'Cada punto es una regla. El tamaño representa el valor de lift. Pasa el cursor para ver detalles.',
    playgroundFreqTitle: 'Ítems Más Frecuentes',
    playgroundTransactions: 'transacciones',
    playgroundItems: 'ítems únicos',
    playgroundSortBy: 'Ordenar por',

    // --- Business Applications ---
    bizTitle: 'Aplicaciones de Negocio',
    bizSubtitle: 'Dónde las reglas de asociación crean valor real',

    bizCard1Title: 'Análisis de Canasta de Mercado',
    bizCard1Desc: 'Supermercados y retailers analizan millones de boletas para optimizar la ubicación de productos, diseñar promociones y construir motores de recomendación.',
    bizCard1Example: 'Insight clásico: "Clientes que compran pañales también compran cerveza los viernes por la tarde"',

    bizCard2Title: 'Recomendaciones en E-commerce',
    bizCard2Desc: '"Clientes que compraron esto también compraron..." — Amazon atribuye el 35% de sus ingresos a su motor de recomendaciones basado en minería de asociaciones.',
    bizCard2Example: 'Venta cruzada de productos complementarios en el checkout para aumentar el ticket promedio',

    bizCard3Title: 'Análisis de Clickstream Web',
    bizCard3Desc: 'La minería de secuencias sobre logs de navegación revela rutas de usuario frecuentes, puntos de abandono y el orden óptimo de contenidos para mejorar la UX.',
    bizCard3Example: 'Descubrir que usuarios que visitan /precios → /características → /testimonios convierten 3x más',

    bizCard4Title: 'Aplicaciones Médicas y Clínicas',
    bizCard4Desc: 'Minería de diagnósticos co-ocurrentes, interacciones de medicamentos y patrones de síntomas en registros clínicos para apoyar la toma de decisiones médicas.',
    bizCard4Example: 'Descubrir que pacientes con condición A + medicamento B tienen 40% más riesgo de complicación C',

    bizCard5Title: 'Detección de Fraude',
    bizCard5Desc: 'Identificar combinaciones inusuales de transacciones que se desvían de los patrones normales de compra, marcando comportamiento potencialmente fraudulento.',
    bizCard5Example: 'Electrónica de alto valor + tarjetas de regalo + envío al extranjero en la misma sesión activa alerta',

    bizCard6Title: 'Cadena de Suministro e Inventario',
    bizCard6Desc: 'Predecir qué productos se piden juntos para optimizar el layout del almacén, compras en lote y rutas de entrega.',
    bizCard6Example: 'Ítems frecuentemente co-comprados se almacenan adyacentes para reducir el tiempo de picking en 25%',

    // --- Case Study ---
    caseTitle: 'Caso de Estudio: Canasta de Supermercado',
    caseSubtitle: 'Análisis paso a paso de un dataset real de supermercado',
    caseStep1: 'Cargar y Explorar Datos',
    caseStep1Desc: 'El dataset Groceries contiene 9.835 transacciones de un supermercado alemán real con 169 ítems únicos. Tamaño promedio de canasta: 4,4 ítems.',
    caseStep2: 'Definir Parámetros',
    caseStep2Desc: 'Empieza conservador: soporte=0.02 (el ítem aparece en el 2% de las transacciones), confianza=0.3. Esto produce un número manejable de reglas para interpretar.',
    caseStep3: 'Interpretar Reglas',
    caseStep3Desc: 'Enfócate en lift > 1.5 para encontrar co-ocurrencias verdaderamente interesantes más allá del azar. Lift=2 significa que los ítems aparecen juntos el doble de lo esperado.',
    caseStep4: 'Acción de Negocio',
    caseStep4Desc: 'Traduce las reglas en acciones: promociones combinadas, cambios de ubicación en góndola, ofertas del programa de lealtad o widget "frecuentemente comprados juntos".',
    caseInsightTitle: 'Insights Clave del Dataset',
    caseInsight1: '{leche entera} → {yogurt}: soporte=5,9%, confianza=23,4%, lift=1,57 — asociación positiva moderada',
    caseInsight2: '{mantequilla, otras verduras} → {leche entera}: confianza=57,3%, lift=2,24 — regla fuerte',
    caseInsight3: '{verduras raíz, yogurt} → {leche entera}: lift=2,25 — el clúster de lácteos es muy coherente',
    caseInsight4: 'La fruta tropical y los cítricos rara vez co-ocurren pese a ambos ser "fruta" — los clientes se especializan',

    // --- Activities ---
    activitiesTitle: 'Actividades y Reflexión',
    activitiesSubtitle: 'Profundiza tu comprensión a través de la experimentación',
    activity1Title: 'Sensibilidad a los Umbrales',
    activity1Desc: 'En el Playground, compara soporte_min=0.01 vs 0.10 en el mismo dataset. ¿Cómo cambia el número de reglas? ¿Qué umbral entrega insights más accionables?',
    activity2Title: 'Lift vs Confianza',
    activity2Desc: 'Encuentra una regla con alta confianza pero lift ≈ 1. ¿Por qué esta regla no es interesante pese a la alta confianza? ¿Qué nos dice sobre la frecuencia base del consecuente?',
    activity3Title: 'Comparación de Datasets',
    activity3Desc: 'Ejecuta los mismos umbrales en los tres datasets (Supermercado, Retail Online, Farmacia). ¿Qué diferencias estructurales observas? ¿Por qué algunos producen más reglas?',
    activity4Title: 'Exploración de Simetría',
    activity4Desc: 'Nota que el soporte es simétrico (A∪B = B∪A) pero la confianza no lo es. Encuentra dos reglas {A}→{B} y {B}→{A} y compara sus confianzas. ¿Qué decisión de negocio apoya cada una?',
    activity5Title: 'Reglas Espurias',
    activity5Desc: '¿Puede una regla tener alto soporte, alta confianza Y lift < 1? Si es así, ¿qué significaría? Si encuentras una, explica por qué un gerente podría actuar erróneamente sobre ella.',
    activity6Title: 'Secuencias vs Reglas',
    activity6Desc: 'Piensa en un dominio donde el ORDEN de los eventos importa y las reglas de asociación darían resultados engañosos. ¿Cómo cambiaría el análisis la minería de secuencias?',

    // --- References ---
    referencesTitle: 'Referencias y Recursos',
    ref1: 'Agrawal, R. & Srikant, R. (1994). Fast Algorithms for Mining Association Rules. VLDB.',
    ref2: 'Han, J., Pei, J. & Yin, Y. (2000). Mining Frequent Patterns without Candidate Generation. SIGMOD.',
    ref3: 'Tan, P., Steinbach, M. & Kumar, V. — Introduction to Data Mining (Capítulo 5)',
    refLink1: 'mlxtend: Reglas de Asociación en Python',
    refLink2: 'Documentación del paquete arules en R',
    refLink3: 'Minería de Patrones Frecuentes — Mining of Massive Datasets (Cap. 6)',
    refLink4: 'Visualización de Reglas de Asociación — arulesViz',

    // --- Footer ---
    footerCreatedBy: 'Creado por',
    footerPortfolio: 'Portafolio',
    footerGithub: 'GitHub',
    footerRights: 'Licencia Apache 2.0',
  },
}
