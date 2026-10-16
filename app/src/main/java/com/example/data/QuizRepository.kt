package com.example.data

import kotlin.random.Random

data class Question(
  val id: String,
  val domainId: String,
  val domainName: String,
  val questionText: String,
  val options: List<String>,
  val correctOptionIndex: Int,
  val explanation: String,
  val safetyStandard: String
)

data class DomainInfo(
  val id: String,
  val title: String,
  val code: String,
  val dgmsStandard: String
)

object QuizRepository {

  val DOMAINS = listOf(
    DomainInfo("fire_extinguisher", "Fire Extinguisher & Flame Suppression", "DGMS-FIRE-01", "CMR 2017 Reg. 138 & ISO 45001"),
    DomainInfo("gas_leakage", "Hazardous Gas & Atmospheric Monitoring", "DGMS-GAS-02", "CMR 2017 Reg. 153 (Ventilation & Mine Gases)"),
    DomainInfo("confined_space", "Confined Space & Heavy Machinery Lockout", "DGMS-MECH-03", "Mines Act 1952 Sec. 22 & OSHA 1910.146"),
    DomainInfo("ppe_emergency", "PPE Compliance & Refuge Chamber Evacuation", "DGMS-EVAC-04", "DGMS Safety Circular No. 04 / IS 2925")
  )

  private val ALL_QUESTIONS = listOf(
    // =========================================================================
    // DOMAIN 1: FIRE EXTINGUISHER & FLAME HAZARD
    // =========================================================================
    Question(
      id = "fire_01",
      domainId = "fire_extinguisher",
      domainName = "Fire Extinguisher & Flame Suppression",
      questionText = "What is the correct sequence of the standard P.A.S.S. technique for operating an underground fire extinguisher?",
      options = listOf(
        "Pull pin, Aim at base of fire, Squeeze lever, Sweep side to side",
        "Push trigger, Aim at top flames, Squeeze handle, Spray downward",
        "Pull ring, Activate valve, Stand back 10 meters, Sweep base",
        "Press button, Aim at smoke plume, Squeeze trigger, Stop immediately"
      ),
      correctOptionIndex = 0,
      explanation = "P.A.S.S. stands for Pull the pin, Aim low at the base of the fire, Squeeze the handle, and Sweep slowly side to side. Aiming at the flames rather than the fuel base is ineffective.",
      safetyStandard = "DGMS Safety Circular No. 02 / NFPA 10 Standard"
    ),
    Question(
      id = "fire_02",
      domainId = "fire_extinguisher",
      domainName = "Fire Extinguisher & Flame Suppression",
      questionText = "Which extinguisher type must NEVER be used on an energized underground electrical substation or transformer fire?",
      options = listOf(
        "Pressurized Water / Soda-Acid Extinguisher",
        "Carbon Dioxide (CO2) Gas Extinguisher",
        "Dry Chemical Powder (ABC / Monoammonium Phosphate)",
        "Halon-alternative Clean Agent Extinguisher"
      ),
      correctOptionIndex = 0,
      explanation = "Water conducts electricity and creates a lethal electrocution hazard for the operator when sprayed on energized circuits. CO2 or Dry Chemical Powder must always be used on Class C/electrical fires.",
      safetyStandard = "CMR 2017 Reg. 138 (Electrical Apparatus Fire Safety)"
    ),
    Question(
      id = "fire_03",
      domainId = "fire_extinguisher",
      domainName = "Fire Extinguisher & Flame Suppression",
      questionText = "What is the recommended initial standing distance when attacking a localized underground conveyor fire with a 9kg ABC dry chemical extinguisher?",
      options = listOf(
        "6 to 8 feet (approx. 2 to 2.5 meters) upwind",
        "1 foot (approx. 30 cm) directly over the belt",
        "25 to 30 feet (approx. 8 to 9 meters)",
        "Directly in line with the return airway smoke plume"
      ),
      correctOptionIndex = 0,
      explanation = "Standing 6 to 8 feet away allows the dry powder cloud to engulf the fuel source effectively without exposing the worker to radiant flash heat or propellant blowback.",
      safetyStandard = "ISO 45001 Industrial Fire Fighting Guidelines"
    ),
    Question(
      id = "fire_04",
      domainId = "fire_extinguisher",
      domainName = "Fire Extinguisher & Flame Suppression",
      questionText = "Under Coal Mines Regulations (CMR) 2017, what is the mandatory routine inspection interval for underground portable fire extinguishers?",
      options = listOf(
        "Monthly physical inspection and annual hydrostatic test",
        "Once every 3 years during mine overhaul",
        "Only after an extinguisher has been discharged",
        "Every 5 years by external certifying agency"
      ),
      correctOptionIndex = 0,
      explanation = "Underground extinguishers must undergo monthly visual checks (pressure gauge in green zone, safety seal intact, hose clear of coal dust) and annual certified hydrostatic pressure tests.",
      safetyStandard = "CMR 2017 Reg. 138 & DGMS Technical Guidelines"
    ),
    Question(
      id = "fire_05",
      domainId = "fire_extinguisher",
      domainName = "Fire Extinguisher & Flame Suppression",
      questionText = "When fighting an open fire along an underground incline haulage drift, from which position must miners approach the flame?",
      options = listOf(
        "From the fresh intake air side (upwind of the fire)",
        "From the return air side (downwind of the fire)",
        "Inside the smoke plume for maximum proximity",
        "Directly below the burning timber roof support"
      ),
      correctOptionIndex = 0,
      explanation = "Always approach an underground fire from the intake (fresh air) side. Approaching from return air exposes miners to toxic Carbon Monoxide, dense smoke, and rapid oxygen depletion.",
      safetyStandard = "DGMS Underground Emergency Response Directive"
    ),
    Question(
      id = "fire_06",
      domainId = "fire_extinguisher",
      domainName = "Fire Extinguisher & Flame Suppression",
      questionText = "What primary fire extinguishing agent is loaded inside Class D specialized fire extinguishers used in mining workshops?",
      options = listOf(
        "Dry powder sodium chloride / copper blend for combustible metals",
        "Pure water under high pressure",
        "Carbon dioxide liquefied at 800 psi",
        "Aqueous film forming foam (AFFF)"
      ),
      correctOptionIndex = 0,
      explanation = "Class D extinguishers are formulated with sodium chloride or copper-based powders specifically engineered to smother combustible metal fires (magnesium, titanium, lithium) without violent explosive reactions.",
      safetyStandard = "NFPA 10 Class D Metallic Standards"
    ),
    Question(
      id = "fire_07",
      domainId = "fire_extinguisher",
      domainName = "Fire Extinguisher & Flame Suppression",
      questionText = "If a fire in an underground stope spreads beyond the control capacity of two handheld portable extinguishers, what is the immediate mandatory protocol?",
      options = listOf(
        "Immediately evacuate personnel to intake air/refuge chamber, don SCSR, and alert control room",
        "Remain at the location and await a second crew with buckets of water",
        "Switch off main ventilation fans without notifying the surface control room",
        "Attempt to build a temporary timber stopping by yourself"
      ),
      correctOptionIndex = 0,
      explanation = "Portable extinguishers are designed for incipient-stage fires only. When uncontrollable, protocol mandates immediate donning of SCSRs, evacuation along marked lifelines, and surface alarm initiation.",
      safetyStandard = "CMR 2017 Reg. 140 (Mine Evacuation Rules)"
    ),
    Question(
      id = "fire_08",
      domainId = "fire_extinguisher",
      domainName = "Fire Extinguisher & Flame Suppression",
      questionText = "What is the primary operational function of an underground fire door or separation stopping in a ventilation district?",
      options = listOf(
        "To isolate combustion fumes and prevent toxic smoke from contaminating intake airways",
        "To store spare tools and firefighting equipment",
        "To increase air velocity inside the burning tunnel",
        "To permanently seal the shaft during normal shifts"
      ),
      correctOptionIndex = 0,
      explanation = "Fire doors and fire-resistant separation stoppings isolate fire zones, preventing lethal carbon monoxide and smoke from entering active worker intake airways and escapeways.",
      safetyStandard = "DGMS Circular No. 06 (Ventilation Isolation Standards)"
    ),
    Question(
      id = "fire_09",
      domainId = "fire_extinguisher",
      domainName = "Fire Extinguisher & Flame Suppression",
      questionText = "Which color band or cylinder color universally designates a Carbon Dioxide (CO2) fire extinguisher in industrial mining facilities?",
      options = listOf(
        "Black label band on a red cylinder (with characteristic horn nozzle)",
        "Bright yellow label with triangular spray cone",
        "Cream color band with standard straight hose",
        "Blue label band with water sprinkler"
      ),
      correctOptionIndex = 0,
      explanation = "Under industrial fire equipment standards (IS 15683 / BS EN 3), CO2 extinguishers feature a black indicator band on the red body, a high-pressure discharge horn, and no pressure gauge (measured by weight).",
      safetyStandard = "IS 15683 Portable Fire Extinguisher Specifications"
    ),
    Question(
      id = "fire_10",
      domainId = "fire_extinguisher",
      domainName = "Fire Extinguisher & Flame Suppression",
      questionText = "Why must water NEVER be poured onto an underground burning diesel fuel or oil spill?",
      options = listOf(
        "Diesel floats on water, causing burning fuel to spread across the tunnel floor",
        "Water accelerates the chemical breakdown of diesel into chlorine gas",
        "Diesel turns into solid rock upon contact with water",
        "Water creates an instantaneous vacuum in the mine airway"
      ),
      correctOptionIndex = 0,
      explanation = "Diesel and lubricating oils are lighter than water (lower specific gravity). Applying water spreads the floating burning liquid down slopes, igniting conveyor belts and timber sets.",
      safetyStandard = "DGMS Circular No. 01 / ISO 45001 Spill Response"
    ),

    // =========================================================================
    // DOMAIN 2: GAS LEAKAGE & ATMOSPHERIC DETECTION
    // =========================================================================
    Question(
      id = "gas_01",
      domainId = "gas_leakage",
      domainName = "Hazardous Gas & Atmospheric Monitoring",
      questionText = "What is the explosive concentration range (Lower Explosive Limit to Upper Explosive Limit) of Methane (CH4) in mine atmosphere?",
      options = listOf(
        "5.0% to 15.0% by volume in air",
        "0.1% to 1.0% by volume in air",
        "25.0% to 50.0% by volume in air",
        "0.05% to 0.5% by volume in air"
      ),
      correctOptionIndex = 0,
      explanation = "Methane is flammable and highly explosive between 5% (LEL) and 15% (UEL) in atmospheric air. Most mining regulations require immediate electrical de-energization at 1.0% and evacuation at 1.25%.",
      safetyStandard = "CMR 2017 Reg. 153 & DGMS Methane Thresholds"
    ),
    Question(
      id = "gas_02",
      domainId = "gas_leakage",
      domainName = "Hazardous Gas & Atmospheric Monitoring",
      questionText = "What is the legal minimum permissible Oxygen (O2) concentration for safe, unassisted human breathing in underground mine workings?",
      options = listOf(
        "19.5% by volume",
        "14.0% by volume",
        "10.0% by volume",
        "25.0% by volume"
      ),
      correctOptionIndex = 0,
      explanation = "Normal surface air is 20.9% O2. Below 19.5% O2 is legally defined as an oxygen-deficient atmosphere requiring supplied-air apparatus. Concentrations below 16% cause rapid disorientation and loss of consciousness.",
      safetyStandard = "DGMS Standard for Mine Air Purity & OSHA 1910.134"
    ),
    Question(
      id = "gas_03",
      domainId = "gas_leakage",
      domainName = "Hazardous Gas & Atmospheric Monitoring",
      questionText = "Why is relying solely on your sense of smell to detect Hydrogen Sulfide (H2S) lethal in underground mines?",
      options = listOf(
        "H2S causes rapid olfactory nerve paralysis at concentrations above 50 ppm",
        "H2S has a sweet pleasant aroma that miners mistake for clean air",
        "H2S cannot enter human nasal passages due to heavy molecular size",
        "H2S is only produced when miners are wearing gas masks"
      ),
      correctOptionIndex = 0,
      explanation = "While H2S has a rotten egg smell at trace levels (<1 ppm), concentrations above 50-100 ppm instantly paralyze the olfactory nerve, giving a false impression that gas has cleared right before collapse.",
      safetyStandard = "DGMS Toxic Gas Hazard Circular / ACGIH Guidelines"
    ),
    Question(
      id = "gas_04",
      domainId = "gas_leakage",
      domainName = "Hazardous Gas & Atmospheric Monitoring",
      questionText = "Where does Methane (CH4) predominantly collect in underground roadways and why?",
      options = listOf(
        "In roof cavities and high spots, because its specific gravity (0.55) is lighter than air",
        "In floor drainage sumps and dips, because it is heavier than air",
        "Only inside diesel vehicle fuel tanks",
        "Evenly dispersed throughout every square inch of the shaft"
      ),
      correctOptionIndex = 0,
      explanation = "Methane has a specific gravity of 0.55 relative to air (1.0). In stagnant or low-velocity air, methane rises and creates explosive layering along the roof and behind roof support canopies.",
      safetyStandard = "CMR 2017 Reg. 153 (Detection of Inflammable Gas)"
    ),
    Question(
      id = "gas_05",
      domainId = "gas_leakage",
      domainName = "Hazardous Gas & Atmospheric Monitoring",
      questionText = "What physiological reaction makes Carbon Monoxide (CO) extremely dangerous even at 100 parts per million (ppm)?",
      options = listOf(
        "CO binds to blood hemoglobin 200 to 250 times more tightly than oxygen, forming carboxyhemoglobin",
        "CO crystallizes inside the lung tissue within 5 seconds",
        "CO dissolves water in the trachea and burns the throat with acid",
        "CO causes extreme body tremors and uncontrollable laughter"
      ),
      correctOptionIndex = 0,
      explanation = "Carbon Monoxide binds to hemoglobin with an affinity 200-250 times greater than oxygen, starving vital organs and brain tissue of oxygen (hypoxia) without triggering normal suffocation panic.",
      safetyStandard = "DGMS Occupational Health Guidelines / NIOSH Standards"
    ),
    Question(
      id = "gas_06",
      domainId = "gas_leakage",
      domainName = "Hazardous Gas & Atmospheric Monitoring",
      questionText = "How often must portable 4-gas digital detectors (O2, CO, H2S, LEL CH4) be 'bump tested' with certified calibration gas?",
      options = listOf(
        "Daily, prior to each work shift before descending the mine shaft",
        "Once a year during general mine inspection",
        "Only when the alarm sounds an error code",
        "Every 6 months by manufacturer representatives"
      ),
      correctOptionIndex = 0,
      explanation = "A bump test verifies sensor response and alarm activation by challenging the detector with a known gas concentration. It is mandatory prior to every work shift.",
      safetyStandard = "DGMS Instrumentation Directive & OSHA Standard 1910.146"
    ),
    Question(
      id = "gas_07",
      domainId = "gas_leakage",
      domainName = "Hazardous Gas & Atmospheric Monitoring",
      questionText = "Where do heavy mine gases such as Carbon Dioxide (CO2 - specific gravity 1.53) tend to settle?",
      options = listOf(
        "In dips, floor cavities, sumps, and blind unventilated headings",
        "Along high roof cracks and exhaust chimneys",
        "Directly around the miner's cap lamp lens",
        "Inside the clean intake air ventilation ducts"
      ),
      correctOptionIndex = 0,
      explanation = "Gases with specific gravity greater than 1.0 (CO2 = 1.53, H2S = 1.19) accumulate in low-lying depressions, sumps, and dead ends where lack of airflow allows suffocating pools to form.",
      safetyStandard = "CMR 2017 Reg. 154 (Accumulation of Noxious Gases)"
    ),
    Question(
      id = "gas_08",
      domainId = "gas_leakage",
      domainName = "Hazardous Gas & Atmospheric Monitoring",
      questionText = "Under standard emergency egress conditions, what is the rated operational life of a chemical oxygen Self-Contained Self-Rescuer (SCSR)?",
      options = listOf(
        "60 minutes of active walking escape (or up to 4 hours at complete rest)",
        "10 minutes only under any conditions",
        "24 hours continuous operation",
        "5 hours of high-intensity sprint running"
      ),
      correctOptionIndex = 0,
      explanation = "Standard mining SCSR units (such as KS-60 or Dräger Oxy) generate breathable oxygen chemically via KO2 for 60 minutes of vigorous escape walking, extending to 4+ hours if resting quietly in a refuge chamber.",
      safetyStandard = "IS 15803 & DGMS Self-Rescuer Deployment Protocol"
    ),
    Question(
      id = "gas_09",
      domainId = "gas_leakage",
      domainName = "Hazardous Gas & Atmospheric Monitoring",
      questionText = "What is the maximum permissible Time-Weighted Average (TWA - 8 hour shift) exposure limit for Carbon Monoxide (CO) under DGMS standards?",
      options = listOf(
        "50 ppm (or 25 ppm under modern international standards)",
        "500 ppm",
        "2,000 ppm",
        "10,000 ppm"
      ),
      correctOptionIndex = 0,
      explanation = "DGMS limits occupational TWA exposure to 50 ppm (with modern DGMS safety circulars targeting 25 ppm). Concentrations of 1,200 ppm are Immediately Dangerous to Life or Health (IDLH).",
      safetyStandard = "DGMS Circular No. 03 (Air Quality Limits)"
    ),
    Question(
      id = "gas_10",
      domainId = "gas_leakage",
      domainName = "Hazardous Gas & Atmospheric Monitoring",
      questionText = "What action must a Continuous Miner or Roadheader operator take if the onboard methane sensor detects 1.0% CH4 at the cutting face?",
      options = listOf(
        "Immediately cut electrical power to cutting head, withdraw cutter, and increase auxiliary ventilation",
        "Accelerate cutting speed to finish the cut before gas rises further",
        "Cover the methane sensor with wet rags to silence the buzzer",
        "Pour water over the electrical junction box"
      ),
      correctOptionIndex = 0,
      explanation = "At 1.0% CH4, statutory regulations require de-energizing the rotating cutting drum, backing machine away from face, checking auxiliary ducting, and verifying ventilation air velocity.",
      safetyStandard = "CMR 2017 Reg. 153 (Machinery Safety in Inflammable Atmospheres)"
    ),

    // =========================================================================
    // DOMAIN 3: CONFINED SPACE & MACHINERY LOCKOUT
    // =========================================================================
    Question(
      id = "conf_01",
      domainId = "confined_space",
      domainName = "Confined Space & Heavy Machinery Lockout",
      questionText = "Before any worker physically enters an underground ore pass, crusher chute, or feeder bin, what is the mandatory first step?",
      options = listOf(
        "Implement Lockout / Tagout (LOTO) on upstream/downstream feeders and verify zero energy state",
        "Turn on all lights and enter immediately to inspect wear plates",
        "Send one junior worker in with a flashlight to verify conditions",
        "Spray water into the chute to loosen any hanging rocks"
      ),
      correctOptionIndex = 0,
      explanation = "Lockout/Tagout (LOTO) of all electrical power, hydraulic drives, and material feeds—along with mechanical block-outs and zero-energy verification—is strictly required prior to any entry.",
      safetyStandard = "Mines Act 1952 Sec. 22 & OSHA 1910.147 (LOTO)"
    ),
    Question(
      id = "conf_02",
      domainId = "confined_space",
      domainName = "Confined Space & Heavy Machinery Lockout",
      questionText = "What is the minimum mandatory crew size for an authorized permit-required confined space entry in mining operations?",
      options = listOf(
        "At least 2 persons: one authorized entrant and one dedicated standby safety attendant",
        "1 person working alone with an active smartphone",
        "5 people all entering the confined vessel together",
        "No crew required if work duration is under 15 minutes"
      ),
      correctOptionIndex = 0,
      explanation = "A confined space entry legally requires at least two individuals: the trained entrant and a designated standby attendant stationed outside who maintains continuous communication and never enters.",
      safetyStandard = "DGMS Safety Circular (Confined Space Protocols) & OSHA 1910.146"
    ),
    Question(
      id = "conf_03",
      domainId = "confined_space",
      domainName = "Confined Space & Heavy Machinery Lockout",
      questionText = "What primary life-safety role does the Standby Attendant ('Hole Watch') serve during confined space maintenance?",
      options = listOf(
        "Maintains continuous visual/voice contact, monitors external hazards, and initiates non-entry rescue",
        "Runs errands and collects spare parts from the surface warehouse",
        "Enters the space unannounced to assist with manual lifting",
        "Operates the conveyor belt while the worker is inside"
      ),
      correctOptionIndex = 0,
      explanation = "The standby attendant must remain at the portal entry at all times, track atmospheric test records, maintain communications with entrants, and operate mechanical rescue winches if an emergency occurs.",
      safetyStandard = "ISO 45001 Confined Space Standards"
    ),
    Question(
      id = "conf_04",
      domainId = "confined_space",
      domainName = "Confined Space & Heavy Machinery Lockout",
      questionText = "Why is a rescue tripod with an emergency mechanical hoist winch required over vertical confined space entries (manholes/chutes)?",
      options = listOf(
        "Enables non-entry retrieval of an incapacitated worker without endangering additional rescuers",
        "Provides a resting seat for the hole watch supervisor",
        "Allows heavy rock drill bits to be dropped into the stope",
        "Used solely to suspend floodlights over the opening"
      ),
      correctOptionIndex = 0,
      explanation = "Statistically, over 60% of confined space fatalities are would-be rescuers entering without equipment. A retrieval tripod allows immediate top-side mechanical extraction without putting second rescuers inside.",
      safetyStandard = "DGMS Technical Advisory & ANSI Z117.1"
    ),
    Question(
      id = "conf_05",
      domainId = "confined_space",
      domainName = "Confined Space & Heavy Machinery Lockout",
      questionText = "What is the mandatory minimum pedestrian standoff safety distance when walking in active haulage drifts near 40-tonne articulated dump trucks?",
      options = listOf(
        "At least 20 meters (65 feet) with confirmed eye contact and positive radio acknowledgment",
        "1 meter alongside the rear dual tires",
        "Directly in front of the truck grille below operator hood line",
        "Walking under the elevated dump bed while the truck is idling"
      ),
      correctOptionIndex = 0,
      explanation = "Underground haul truck blind spots extend over 15-20 meters to the front-right and rear. Workers must maintain at least 20m distance, stand on the pedestrian walkway, and wait for positive driver hand/horn signals.",
      safetyStandard = "DGMS Safety Circular (Underground Trackless Vehicles)"
    ),
    Question(
      id = "conf_06",
      domainId = "confined_space",
      domainName = "Confined Space & Heavy Machinery Lockout",
      questionText = "What must be done to the hydraulic dump box of an underground LHD (Load Haul Dump) or haul truck before inspecting beneath it?",
      options = listOf(
        "Install certified structural steel safety prop/chock pins to physically lock the bed in position",
        "Rely on the hydraulic control lever being in the neutral position",
        "Place a wooden broom handle under the cylinder",
        "Keep the diesel engine running at full RPM"
      ),
      correctOptionIndex = 0,
      explanation = "Hydraulic pressure can fail instantaneously through blown hoses, leaking valves, or accidental lever bumping. A certified mechanical steel safety lock or prop pin is legally required before working beneath raised beds.",
      safetyStandard = "CMR 2017 Reg. 184 (Safety in Maintenance of Dumpers)"
    ),
    Question(
      id = "conf_07",
      domainId = "confined_space",
      domainName = "Confined Space & Heavy Machinery Lockout",
      questionText = "Under standard industrial LOTO procedures, who is authorized to remove a safety padlock from an electrical breaker panel?",
      options = listOf(
        "Only the specific worker who applied the padlock, after confirming all tools and personnel are clear",
        "Any supervisor with a master key or bolt cutters",
        "The shift electrician from the next shift without contacting anyone",
        "The machine operator wanting to start work early"
      ),
      correctOptionIndex = 0,
      explanation = "The golden rule of LOTO is 'One Person, One Lock, One Key'. Only the person who installed the lock may remove it, guaranteeing equipment cannot be re-energized while that worker is exposed.",
      safetyStandard = "OSHA 1910.147 & ISO 45001 Life Saving Rules"
    ),
    Question(
      id = "conf_08",
      domainId = "confined_space",
      domainName = "Confined Space & Heavy Machinery Lockout",
      questionText = "What is the dangerous phenomenon of 'Bridging' or 'Hung-up Ore' when entering an underground drawpoint or ore bin?",
      options = listOf(
        "A false ceiling of compacted rock arched over a large void, which can collapse suddenly without warning",
        "A bridge constructed by timbermen across an active haulage drive",
        "A high-speed communication cable connecting underground to surface",
        "A decorative archway built at the mine entrance portal"
      ),
      correctOptionIndex = 0,
      explanation = "Ore can pack and form a cohesive arch above an empty void. Walking on or beneath hung-up ore has buried numerous miners when the arch collapsed dynamically under vibration.",
      safetyStandard = "DGMS Drawpoint & Stope Safety Circular"
    ),
    Question(
      id = "conf_09",
      domainId = "confined_space",
      domainName = "Confined Space & Heavy Machinery Lockout",
      questionText = "What type of personal fall protection harness is mandatory when descending a vertical shaft or stope manhole?",
      options = listOf(
        "Full-body harness with dorsal D-ring attached to a self-retracting lifeline (SRL)",
        "Single leather waist belt without shoulder or leg straps",
        "Standard cotton rope tied loosely around the waist",
        "No harness needed if holding onto the side ladder rungs"
      ),
      correctOptionIndex = 0,
      explanation = "Body belts are prohibited because fall forces cause fatal abdominal and spine trauma. A full-body harness distributes arresting force safely across thighs, pelvis, chest, and shoulders.",
      safetyStandard = "IS 3521 / EN 361 Fall Protection Standards"
    ),
    Question(
      id = "conf_10",
      domainId = "confined_space",
      domainName = "Confined Space & Heavy Machinery Lockout",
      questionText = "If continuous forced mechanical ventilation to a confined tunnel space fails, what is the mandatory immediate action?",
      options = listOf(
        "Immediately cease work, disconnect tools, and evacuate the space to fresh intake air",
        "Continue working quickly for 30 minutes before deciding to leave",
        "Breathe through your cotton shirt collar to filter stagnant air",
        "Start an internal combustion generator inside the confined area"
      ),
      correctOptionIndex = 0,
      explanation = "Without active mechanical ventilation, oxygen depletion and toxic gas accumulation occur rapidly. Immediate egress to an actively ventilated intake roadway is mandatory.",
      safetyStandard = "CMR 2017 Reg. 153 (Auxiliary Ventilation Rules)"
    ),

    // =========================================================================
    // DOMAIN 4: PPE COMPLIANCE & REFUGE CHAMBER EVACUATION
    // =========================================================================
    Question(
      id = "ppe_01",
      domainId = "ppe_emergency",
      domainName = "PPE Compliance & Refuge Chamber Evacuation",
      questionText = "What electrical and impact classification is statutory for safety helmets (hard hats) worn in underground mechanized mines?",
      options = listOf(
        "Class E (Electrical rating up to 20,000 Volts dielectric protection) conforming to IS 2925",
        "Class C (Conductive aluminum shell with zero electrical insulation)",
        "Standard plastic baseball cap with no suspension cradle",
        "Class G (General service up to 2,200 Volts only)"
      ),
      correctOptionIndex = 0,
      explanation = "Underground mechanized mines require Class E hard hats tested against both high-velocity rock impact and high-voltage electrical flashover (dielectric proof-tested to 20,000V).",
      safetyStandard = "IS 2925 & DGMS Approved PPE Specifications"
    ),
    Question(
      id = "ppe_02",
      domainId = "ppe_emergency",
      domainName = "PPE Compliance & Refuge Chamber Evacuation",
      questionText = "What crucial structural feature distinguishes underground mining safety boots from standard construction footwear?",
      options = listOf(
        "Integrated metatarsal protection guard covering the delicate upper foot bones, plus steel shank puncture-resistant sole",
        "Soft canvas fabric for maximum flexibility during long walks",
        "High-heeled leather boots designed for horse riding",
        "Open-toe breathable sandals for hot underground drives"
      ),
      correctOptionIndex = 0,
      explanation = "Underground miners face severe risk from falling rock fragments striking the upper foot. Metatarsal guards shield the metatarsal bones, while puncture-resistant steel midsoles prevent nail penetration.",
      safetyStandard = "IS 15298 / DGMS Circular for Footwear"
    ),
    Question(
      id = "ppe_03",
      domainId = "ppe_emergency",
      domainName = "PPE Compliance & Refuge Chamber Evacuation",
      questionText = "When escaping through dense smoke using the underground lifeline, how do tactile directional cones indicate the path to safety?",
      options = listOf(
        "The pointed end of the cone points towards the exit / fresh air shaft (point points to safety)",
        "The flat wide end points towards the exit",
        "Cones are random and have no directional orientation",
        "Cones must be unscrewed and carried in your pocket"
      ),
      correctOptionIndex = 0,
      explanation = "Standard mining lifelines feature cone-shaped tactile markers spaced every 50-100 feet. The point of the cone always points in the direction of the surface exit / fresh air escapeway.",
      safetyStandard = "DGMS Safety Circular (Tactile Lifeline Standards)"
    ),
    Question(
      id = "ppe_04",
      domainId = "ppe_emergency",
      domainName = "PPE Compliance & Refuge Chamber Evacuation",
      questionText = "What sensory warning signal is introduced into underground compressed air lines or ventilation shafts during a whole-mine emergency evacuation?",
      options = listOf(
        "Stench Gas (Ethyl Mercaptan - strong pungent rotten cabbage odor)",
        "Sweet peppermint aroma mist",
        "Water vapor to increase humidity",
        "Liquid nitrogen freezing fog"
      ),
      correctOptionIndex = 0,
      explanation = "Stench gas (Ethyl Mercaptan) is released into main air intakes or compressed air headers during catastrophic emergencies. Because sound alarms may not penetrate loud machinery, miners recognize the distinct pungent smell instantly.",
      safetyStandard = "DGMS Emergency Warning Protocol / MSHA Standards"
    ),
    Question(
      id = "ppe_05",
      domainId = "ppe_emergency",
      domainName = "PPE Compliance & Refuge Chamber Evacuation",
      questionText = "What external visual and audible beacons identify an active underground Mobile Refuge Chamber in low-visibility smoke?",
      options = listOf(
        "High-intensity green/amber flashing strobe light, reflective outline tape, and intermittent pneumatic sound siren",
        "Black matte paint with zero reflective markings",
        "A red flickering candle placed at the entryway",
        "A tiny handwritten cardboard sign hung on a nail"
      ),
      correctOptionIndex = 0,
      explanation = "Refuge chambers feature flashing strobes, 360-degree reflective perimeter striping, and siren beacons so miners blinded by thick smoke or cap-lamp failure can locate the airlock entryway.",
      safetyStandard = "DGMS Circular (Refuge Chamber Construction) & ISO 45001"
    ),
    Question(
      id = "ppe_06",
      domainId = "ppe_emergency",
      domainName = "PPE Compliance & Refuge Chamber Evacuation",
      questionText = "Under standard DGMS mining regulations, for how long must an underground Refuge Chamber sustain sealed life-support without surface power?",
      options = listOf(
        "At least 48 hours (including compressed O2 cylinders, CO2 scrubber chemicals, food, water, and battery power)",
        "2 hours maximum",
        "30 minutes only",
        "10 days with luxury air conditioning"
      ),
      correctOptionIndex = 0,
      explanation = "Certified refuge chambers must sustain full occupancy for a minimum of 48 hours (with many modern units rated to 96 hours) using onboard chemical CO2 scrubbers and medical O2 banks.",
      safetyStandard = "DGMS Directive on Underground Refuge Stations"
    ),
    Question(
      id = "ppe_07",
      domainId = "ppe_emergency",
      domainName = "PPE Compliance & Refuge Chamber Evacuation",
      questionText = "At what noise exposure threshold is mandatory hearing protection (earmuffs/plugs) required for underground miners operating rock drills?",
      options = listOf(
        "85 dBA continuous (or 140 dBC peak impact noise) over an 8-hour shift",
        "120 dBA only if worker feels pain",
        "40 dBA equivalent to a library reading room",
        "Hearing protection is optional in underground mines"
      ),
      correctOptionIndex = 0,
      explanation = "DGMS standards require hearing conservation measures and certified hearing PPE whenever noise levels exceed 85 dBA TWA. Hydraulic jumbo drills and ventilation fans often exceed 100-115 dBA.",
      safetyStandard = "DGMS Circular No. 05 (Occupational Hearing Conservation)"
    ),
    Question(
      id = "ppe_08",
      domainId = "ppe_emergency",
      domainName = "PPE Compliance & Refuge Chamber Evacuation",
      questionText = "Why must miners inspect their Cordless Cap Lamp battery charge indicator and glass seal before descending into the pit?",
      options = listOf(
        "Statutory minimum 12-hour full luminescence is required, and crack-free casing prevents flammable methane ignition",
        "Cap lamps are checked solely to ensure the miner looks uniform in photos",
        "The battery must be discharged to zero before entering the shaft",
        "Cap lamps are only used if the miner loses their cell phone"
      ),
      correctOptionIndex = 0,
      explanation = "Cap lamps are intrinsically safe (explosion-proof certified). A cracked lens can expose an incandescent arc to methane gas, and a flat battery leaves the worker immobilized in total underground darkness.",
      safetyStandard = "CMR 2017 Reg. 165 (Electric Lighting & Miners Lamps)"
    ),
    Question(
      id = "ppe_09",
      domainId = "ppe_emergency",
      domainName = "PPE Compliance & Refuge Chamber Evacuation",
      questionText = "What minimum grade of retroreflective striping is required on mining coveralls and high-visibility vests?",
      options = listOf(
        "Class 3 High-Visibility fluorescent orange/lime with 360-degree reflective bands visible from 300 meters",
        "Class 1 dark brown vest with non-reflective fabric",
        "Plain white cotton t-shirt with no reflective elements",
        "Black synthetic raincoat with no striping"
      ),
      correctOptionIndex = 0,
      explanation = "Underground darkness and heavy trackless machinery require Class 3 high-visibility garments with dual horizontal and vertical reflective torso bands ensuring 360-degree detection by vehicle operators.",
      safetyStandard = "IS 15809 / EN ISO 20471 High Visibility Standards"
    ),
    Question(
      id = "ppe_10",
      domainId = "ppe_emergency",
      domainName = "PPE Compliance & Refuge Chamber Evacuation",
      questionText = "Upon entering an underground Refuge Chamber during a toxic gas emergency, what is the critical procedure before opening the inner door?",
      options = listOf(
        "Seal outer airlock door, purge contaminated air in airlock chamber, check O2/CO2 levels, then enter main living chamber",
        "Leave outer door open so trailing miners can walk in freely",
        "Remove your SCSR outside before entering the airlock",
        "Blow a whistle continuously inside the sealed chamber"
      ),
      correctOptionIndex = 0,
      explanation = "Refuge chambers utilize a positive-pressure airlock vestibule. Entrants must seal the outer door and purge smoke/gas using compressed air before opening the inner door to preserve the clean breathable living atmosphere.",
      safetyStandard = "DGMS Refuge Chamber Operation Manual & ISO 45001"
    )
  )

  /**
   * Retrieves randomized questions for a specific domain.
   * Shuffles questions, selects [count] questions, and shuffles options for each question
   * while adjusting the correctOptionIndex accurately!
   */
  fun getRandomQuestions(domainId: String, count: Int = 5): List<Question> {
    val domainPool = ALL_QUESTIONS.filter { it.domainId == domainId }
    val candidatePool = if (domainPool.isEmpty()) {
      ALL_QUESTIONS.filter { it.domainId == "fire_extinguisher" }
    } else {
      domainPool
    }

    // 1. Shuffle question pool and pick random subset
    val selectedQuestions = candidatePool.shuffled(Random(System.currentTimeMillis())).take(count)

    // 2. For each question, shuffle its options and track new correct index
    return selectedQuestions.map { q ->
      val indexedOptions = q.options.mapIndexed { index, option -> Pair(index, option) }
      val shuffledIndexedOptions = indexedOptions.shuffled(Random(System.currentTimeMillis() + q.id.hashCode()))
      val newCorrectIndex = shuffledIndexedOptions.indexOfFirst { it.first == q.correctOptionIndex }

      q.copy(
        options = shuffledIndexedOptions.map { it.second },
        correctOptionIndex = if (newCorrectIndex >= 0) newCorrectIndex else 0
      )
    }
  }

  fun getDomainTitle(domainId: String): String {
    return DOMAINS.firstOrNull { it.id == domainId }?.title ?: "Mining Safety Drill"
  }

  fun getDomainCode(domainId: String): String {
    return DOMAINS.firstOrNull { it.id == domainId }?.code ?: "DGMS-001"
  }
}
