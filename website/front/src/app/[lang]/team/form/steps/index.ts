import { Step } from "../../../../../types/step.type";

const createTeamFields = ['name', 'slogan', 'mentorFullName'];

const joinTeamFields = ['teamId', 'accessCode'];

export const steps: Step[] = [
  {
    id: 'Étape 1',
    name: "Options d'équipe",
    getFields: (_) => [],
  },
  {
    id: 'Étape 2',
    name: 'Créer / Rejoindre une Équipe',
    getFields: (formType?: string) => {
      switch(formType) {
        case 'create':
          return createTeamFields
        case 'join':
          return joinTeamFields
        default:
          return []
      }
    }
  },
  {
    id: 'Étape 3',
    name: 'Récapitulatif',
    getFields: (_) => [],
  },
];
