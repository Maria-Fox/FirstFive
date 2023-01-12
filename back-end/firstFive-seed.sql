INSERT INTO users (username, password, contact_num, contact_email, type_of_user, bio)
VALUES ('softwareDev1',
        '123456789SoftwareDev1',
        '9165493468',
        'softwaredev1@gmail.com',
        'professional',
        'Software Developer with almost a year of experience. Looking to work with a company in the retail industry!'),
      ( 'uxDesProf',
        'theBestDesignerEver321',
        '7075436291',
        'uxdesignspecialist@aol.com',
        'professional',
        'UX Designer for 4 years. Interested in working with small teams that can use some additional help! Open availability.'),
      ( 'All_Right_Industries',
        'thefirstcompany654',
        '7076289517',
        'allrightindustries@realty.com',
        'small company',
        'All Right Indsutries is a small 10 employee company working with local schools to provide mental health services to children.'),
      ( 'Decia_Marketing',
        'decias6549870',
        '9165439876',
        'deciasmarketing@dentalmarketing.com',
        'small company',
        'Decia Marketing is a small 30 employee company marketing dental services. We service 20 offices in the local area and are looking to grow into the regional or national market by marketing through a new website!'
        );

  INSERT INTO company_requests(co_username, project_desc, timeframe, searching_for_professional) 
  VALUES ('All_Right_Industries',
            'All Right Indsutries would like to add a website to provide online mental health services. Project scope is not fully planned out yet, we are hoping ot get some expert guidance from the professional(s) interested in the project. We are looking for a full development team including UX Designers.',
            'Timeframe is flexible',
            'Software Developer back-end OR front-end'
          ), 
          ('All_Right_Industries',
            'All Right Indsutries would like to add a website to provide online mental health services. Project scope is not fully planned out yet, we are hoping ot get some expert guidance from the professional(s) interested in the project.We are looking for a full development team including UX Designers.',
            'Timeframe is flexible',
            'UX Designer'),
          ('Decia_Marketing',
            'Decia Marketing has a lot of print marketing experience but limited online exposure. We are hoping to change that with the help of a software development team. We are happy to work with a front-end developer, a back-end developer, and a UX designer.',
            '3-6 months',
            'Software Developer back-end OR front-end'
          ),
          ('Decia_Marketing',
              'Decia Marketing has a lot of print marketing experience but limited online exposure. We are hoping to change that with the help of a software development team. We are happy to work with a front-end developer, a back-end developer, and a UX designer.',
              '3-6 months',
              'UX Designer'
          );