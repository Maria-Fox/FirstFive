INSERT INTO users (username, password, email, bio)
VALUES ('softwareDev1',
        '123456789SoftwareDev1',
        'softwaredev1@gmail.com',
        'Software Developer with almost a year of experience. Looking to work with a group using Node.js or React!'),
      ( 'uxDesProf',
        'theBestDesignerEver321',
        'uxdesignspecialist@aol.com',
        'UX Designer for 4 years. Interested in working with small teams that can use some additional help! Open availability.'),
      ( 'bestUxDesigner',
        'bestUxDesigner654',
        'bestux1@aol.com',
        'UX Designer with 2 years of experience. Looking to work on a larger group project to cement my skills.'),
      ( 'Delia_Designs',
        'decias6549870',
        'delia466@dentalmarketing.com',
        'Just starting out my software journey! I would like to join a small project with React.'
        );

  INSERT INTO projects(owner_username, name, project_desc, timeframe, github_repo) 
  VALUES ('softwareDev1',
            'React Card Game',
            'Build out a fully featured React app using a deck API chosen by the group! Open to other additional technologies.',
            'Hoping to start asap, project can take a month.',
            'https://github.com/'), 
          ('uxDesProf',
            'Re-design an existing e-commerce website.',
            'Re-design amazon, or target /any larger online corporation.',
            'Depending on how many changes, perhaps 1-2 months.',
            'https://github.com/'),
          ('bestUxDesigner',
            'Mock SaaS Dashboard',
            'Design a SaaS dashboard showing account overview, stats, etc.',
            '2-3 months, unsure.',
            'https://github.com/'),
          ('Delia_Designs',
              'Design a smart TV APP layout ',
              'Beautifully design an interface for smart TV platforms. Include comprehnsive resting for all devices.',
              '3-6 months',
              'https://github.com/'
          );

-- INSERT INTO matches (project_id, username) VALUES (3, 'bestUxDesigner');
-- INSERT INTO users (username, password, , email, bio ) VALUES ('terminalUser', '123456pw', '9165286419', 'email@bestemail.com', 'this is bio');

-- INSERT INTO projects(owner_username, name, project_desc, timeframe, github_repo) VALUES ('fromCLI','alalalla','Build out ...... chosen by the group! Open to other additional technologies.','1 day','https://github.com/');