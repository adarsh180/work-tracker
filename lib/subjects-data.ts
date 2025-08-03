export const SUBJECTS_DATA = {
  physics: {
    id: 'physics' as const,
    name: 'Physics',
    color: 'blue',
    chapters: [
      { name: 'Basics Maths', lectures: 15 },
      { name: 'Unit & Dimension', lectures: 12 },
      { name: 'Vectors', lectures: 9 },
      { name: 'Motion in Straight Line', lectures: 16 },
      { name: 'Motion in Plane', lectures: 10 },
      { name: 'Laws of Motion', lectures: 18 },
      { name: 'WPE & COM', lectures: 12 },
      { name: 'Rotation Motion', lectures: 14 },
      { name: 'Gravitation', lectures: 8 },
      { name: 'Mech Prop Sol & Fluid', lectures: 8 },
      { name: 'Thermal Prop', lectures: 9 },
      { name: 'KTG & Thermodynamic', lectures: 8 },
      { name: 'Oscillations', lectures: 7 },
      { name: 'Waves', lectures: 9 },
      { name: 'Elec Charge & Field', lectures: 10 },
      { name: 'Electrostatic & Capci', lectures: 12 },
      { name: 'Current Electricity', lectures: 10 },
      { name: 'Moving Charges & Magnetism', lectures: 2 },
      { name: 'Magnetism & Matter', lectures: 10 },
      { name: 'Electromag Induction', lectures: 7 },
      { name: 'AC Waves & EM Waves', lectures: 8 },
      { name: 'Ray Optics', lectures: 11 },
      { name: 'Optics', lectures: 6 },
      { name: 'Dual Nature, Atoms & Nuclei', lectures: 6 },
      { name: 'Semicon', lectures: 12 }
    ]
  },
  chemistry: {
    id: 'chemistry' as const,
    name: 'Chemistry',
    color: 'green',
    chapters: [
      // Physical Chemistry
      { name: 'Basic Concepts', lectures: 15 },
      { name: 'Redox Reaction', lectures: 7 },
      { name: 'Solution', lectures: 11 },
      { name: 'Thermodynamics', lectures: 12 },
      { name: 'Chem Equilibrium', lectures: 7 },
      { name: 'Ionic Equilibrium', lectures: 11 },
      { name: 'Electrochemistry', lectures: 9 },
      { name: 'Chem Kinetics', lectures: 9 },
      { name: 'Structure of Atoms', lectures: 11 },
      { name: 'Practical Phy Chem', lectures: 2 },
      // Inorganic Chemistry
      { name: 'Periodicity', lectures: 14 },
      { name: 'Chemical Bonding', lectures: 18 },
      { name: 'Coordination Compounds', lectures: 12 },
      { name: 'D-F Block', lectures: 6 },
      { name: 'P-Block', lectures: 9 },
      { name: 'Salt Analysis', lectures: 6 },
      // Organic Chemistry
      { name: 'IUPAC', lectures: 12 },
      { name: 'Isomerism', lectures: 15 },
      { name: 'GOC', lectures: 14 },
      { name: 'Hydrocarbon', lectures: 14 },
      { name: 'Haloalkanes', lectures: 10 },
      { name: 'Alcohols & Phenols', lectures: 8 },
      { name: 'Aldehydes & Acids', lectures: 11 },
      { name: 'Amines', lectures: 6 },
      { name: 'Biomolecules', lectures: 7 },
      { name: 'Purification & Quant', lectures: 3 }
    ]
  },
  botany: {
    id: 'botany' as const,
    name: 'Botany',
    color: 'emerald',
    chapters: [
      { name: 'Cell', lectures: 12 },
      { name: 'Cell Cycle', lectures: 6 },
      { name: 'Living World', lectures: 5 },
      { name: 'Classification', lectures: 7 },
      { name: 'Plant Kingdom', lectures: 10 },
      { name: 'Morphology', lectures: 18 },
      { name: 'Anatomy', lectures: 12 },
      { name: 'Respiration', lectures: 14 },
      { name: 'Photosynthesis', lectures: 8 },
      { name: 'PGR', lectures: 8 },
      { name: 'Sexual Repro', lectures: 9 },
      { name: 'MBI', lectures: 8 },
      { name: 'POI', lectures: 1 },
      { name: 'Microbes', lectures: 6 },
      { name: 'Organism', lectures: 9 },
      { name: 'Ecosystem', lectures: 12 },
      { name: 'Environmental Issues', lectures: 10 },
      { name: 'Biodiversity', lectures: 10 }
    ]
  },
  zoology: {
    id: 'zoology' as const,
    name: 'Zoology',
    color: 'purple',
    chapters: [
      { name: 'Structural Organisation', lectures: 13 },
      { name: 'Breathing', lectures: 7 },
      { name: 'Body Fluid', lectures: 9 },
      { name: 'Excretion', lectures: 16 },
      { name: 'Locomotion', lectures: 10 },
      { name: 'Neural Control', lectures: 18 },
      { name: 'Chemical Control', lectures: 12 },
      { name: 'Animal Kingdom', lectures: 14 },
      { name: 'Biomolecules', lectures: 8 },
      { name: 'Human Reproduction', lectures: 8 },
      { name: 'Reproductive Health', lectures: 9 },
      { name: 'Diseases', lectures: 8 },
      { name: 'Biotech Processes', lectures: 7 },
      { name: 'Biotech Applications', lectures: 9 },
      { name: 'Evolution', lectures: 12 }
    ]
  }
};

export const getEmojiForPercentage = (percentage: number): string => {
  if (percentage >= 95) return '😘';
  if (percentage >= 85) return '😊';
  if (percentage >= 75) return '😕';
  return '😞';
};