export const getCategories = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 0,
          name: "Management",
        },
        {
          id: 1,
          name: "Network Design",
        },
        {
          id: 2,
          name: "Training & Sport",
        },
        {
          id: 3,
          name: "Web Dev",
        },
        {
          id: 4,
          name: "DeFi",
        },
        {
          id: 5,
          name: "Tokenomics",
        },
        {
          id: 6,
          name: "Painting",
        },
        {
          id: 7,
          name: "Consesus",
        },
        {
          id: 8,
          name: "Photography",
        },
        {
          id: 9,
          name: "Community",
        },
        {
          id: 10,
          name: "Governance",
        },
        {
          id: 11,
          name: "Teaching",
        },
        {
          id: 12,
          name: "Architecture",
        },
        {
          id: 13,
          name: "Frontend Dev",
        },
        {
          id: 14,
          name: "Gardening",
        },

        {
          id: 15,
          name: "Mobile Dev",
        },
        {
          id: 16,
          name: "Video-Making",
        },
        {
          id: 17,
          name: "Legal",
        },
        {
          id: 18,
          name: "Smart Contracts",
        },
        {
          id: 19,
          name: "Game Theory",
        },
        {
          id: 20,
          name: "Householding",
        },
        {
          id: 21,
          name: "Backend",
        },
        {
          id: 22,
          name: "Blockchain",
        },
      ]);
    }, 2000);
  });
};

export const getSkillTreeBySkill = (skill) => {};

export const getSkills = async (categoryId: string) => {
  return fetch(
    `https://api.distributed.town/api/skill?skill=${encodeURIComponent(
      categoryId
    )}`,
    { method: "GET" }
  )
    .then((res) => res.json())
    .then(({ categories }) => categories)
    .catch(() => []);
};
