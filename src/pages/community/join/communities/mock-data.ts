const mockCommunity = {
  name: 'Local Projects & DAOs',
  members: 1,
  scarcityScore: 0,
  address: '0x04c98BDA5DF252F53Ae026ae7af9e294F204D58d',
  description: 'From support for people in need, to innovative local hubs to get together & create something greater than oneself.',
};
const skillsJson = {
  skill1: {
    level: 4,
    displayStringId: 32,
    skillName: 'DeFi',
  },
  skill2: {
    level: 2,
    displayStringId: 28,
    skillName: 'Backend',
  },
  skill3: {
    level: 4,
    displayStringId: 24,
    skillName: 'Network Design',
  },
};
const username = 'Tao';
const skillsFormated = {
  skills: [
    {
      name: skillsJson.skill1.skillName,
      value: skillsJson.skill1.level,
    },
    {
      name: skillsJson.skill2.skillName,
      value: skillsJson.skill2.level,
    },
  ],
};
if (skillsJson.skill3) {
  skillsFormated.skills.push({
    name: skillsJson.skill3.skillName,
    value: skillsJson.skill3.level,
  });
}
const metadataJson = {
  name: `${username}'s SkillWallet`,
  description: 'Universal, self-sovereign IDs tied to skills & contributions rather than personal data.',
  image: null,
  properties: {
    username,
    skills: skillsFormated.skills,
  },
};

export { mockCommunity, metadataJson };
