/**
 * Preventive Care Plan Generation Engine
 * Creates tailored veterinary health, grooming, and medication reminders
 * based on pet species, lifecycle stage, and health profile.
 */
exports.buildCarePlanTemplates = (pet) => {
    const now = new Date();
    const addDays = (days) => {
        const d = new Date(now);
        d.setDate(d.getDate() + days);
        return d;
    };

    const planTemplates = [];

    if (pet.species === 'dog') {
        planTemplates.push(
            {
                title: `Rabies & DHPP Vaccination Booster for ${pet.name}`,
                type: 'vaccination',
                dueDate: addDays(21),
                time: '10:00 AM',
                frequency: 'yearly',
                notes: 'Core annual rabies and distemper/parvovirus booster immunization.',
                isAutomated: true
            },
            {
                title: `Monthly Flea, Tick & Heartworm Prevention Chew`,
                type: 'medication',
                dueDate: addDays(5),
                time: '08:30 AM',
                frequency: 'monthly',
                notes: 'Administer tasty chewable with breakfast for 30-day parasite defense.',
                isAutomated: true
            },
            {
                title: `Deep Coat Bath, De-shed & Nail Trim Session`,
                type: 'grooming',
                dueDate: addDays(14),
                time: '02:00 PM',
                frequency: 'monthly',
                notes: 'Full coat wash with soothing oatmeal shampoo, ear cleaning, and paw pad trim.',
                isAutomated: true
            },
            {
                title: `Comprehensive Annual Vet Checkup & Dental Scaling`,
                type: 'vet-visit',
                dueDate: addDays(90),
                time: '11:00 AM',
                frequency: 'yearly',
                notes: 'Full body physical, heart & joint assessment, and dental tartar evaluation.',
                isAutomated: true
            }
        );
    } else if (pet.species === 'cat') {
        planTemplates.push(
            {
                title: `FVRCP 3-in-1 Feline Vaccine Booster for ${pet.name}`,
                type: 'vaccination',
                dueDate: addDays(30),
                time: '10:30 AM',
                frequency: 'yearly',
                notes: 'Protection against feline viral rhinotracheitis, calicivirus and panleukopenia.',
                isAutomated: true
            },
            {
                title: `Monthly Topical Flea & Ear Mite Defense`,
                type: 'medication',
                dueDate: addDays(7),
                time: '09:00 AM',
                frequency: 'monthly',
                notes: 'Apply single-dose spot-on treatment at base of neck.',
                isAutomated: true
            },
            {
                title: `Slicker Brush Fur De-matting & Claw Trimming`,
                type: 'grooming',
                dueDate: addDays(10),
                time: '05:00 PM',
                frequency: 'weekly',
                notes: 'Gentle deshedding to prevent hairballs and keep claws at comfortable length.',
                isAutomated: true
            },
            {
                title: `Annual Senior Vitality Exam & Bloodwork`,
                type: 'vet-visit',
                dueDate: addDays(120),
                time: '09:30 AM',
                frequency: 'yearly',
                notes: 'Kidney function, thyroid, and dental plaque examination.',
                isAutomated: true
            }
        );
    } else {
        planTemplates.push(
            {
                title: `Routine Health & Vitality Examination for ${pet.name}`,
                type: 'vet-visit',
                dueDate: addDays(30),
                time: '11:00 AM',
                frequency: 'yearly',
                notes: 'General wellness check, weight monitoring, and dietary assessment.',
                isAutomated: true
            },
            {
                title: `Habitat Deep Clean & Sanitization Cycle`,
                type: 'other',
                dueDate: addDays(7),
                time: '04:00 PM',
                frequency: 'weekly',
                notes: 'Sanitize bedding, replenish fresh filters/substrate, and check temperature.',
                isAutomated: true
            }
        );
    }

    return planTemplates;
};
