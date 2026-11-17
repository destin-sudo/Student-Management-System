INSERT OR IGNORE INTO users (user_id, identifier, matric_number, full_name, department, gender, year_level, role, password_salt, password_hash) VALUES
  ('user-1', 'RUN/CMP/24/17176', 'RUN/CMP/24/17176', 'Destiny Ayegba', 'Computer Science', 'Female', 300, 'student', 'c98049f252e33c14e6e78f34faedefba', 'a08014d95f9d36c191d29bc2c3d6d98787ead0f9f330d6eaf7807ea2a6b77e275e5bfbb17cc6fd5ecd46eb8bb524efd1b7e53606b6236f91f809fbce2564e67d'),
  ('user-2', 'Run/cmp/24/17174', 'Run/cmp/24/17174', 'Ayanbiyi Abiodun', 'Computer Science', 'Male', 300, 'student', '7c613a216d4013a4fffbee43b45c135d', '4a43d282681ada4cd19b791d087f7bcca81f0f6983535c48a53b1b952ce2618a76f5cad371b58afcd094d96728bc449429a82c1e0d726371f8ee46aff7f5a445'),
  ('user-3', 'run/cmp/24/17175', 'run/cmp/24/17175', 'Inioluwa Ayandare', 'Information Technology', 'Male', 300, 'student', 'b950673340bcf856b88259f80f333f42', '22314a568987605c9124e289e47bc98c3ecce03684ed9bc25e901df6f6f3cbfe2f95a84ec4cb25f1c2dade8441cd04d9fce1173a43e9f6d2f7c547142185181a'),
  ('user-4', 'run/cmp/24/17189', 'run/cmp/24/17189', 'Adeshola Emiloju', 'Computer Science', 'Male', 300, 'student', '67405baded4c7db238e0fcae24944c18', 'a0ccf33625b8607c8ecd0920e32810ade07f9f2f3d268feb43e7f2b7e14144bf1bc8be213b290387a89bec03f07c32803c7db7c782334b74f13b72203e7a3007'),
  ('user-5', 'run/cmp/24/17178', 'run/cmp/24/17178', 'Kolawole Balogun', 'Not provided', 'Not provided', 300, 'student', '7d35f148ac2031456c98b2aa80e0150e', '6e4aee7d98533ff82c18dff3cf624210caadb875a10f1e162fbba28d7425c07a2f4e18093f3bd23717c6a27ec87e2fcfe56b489eb7e4ba7aed2049812f3f0b2a'),
  ('user-6', 'instructor', NULL, 'Miss Oluwaseun Amore', 'Computer Science', 'Female', NULL, 'instructor', '7de72625cacfc6f17aaf64a117f73050', '404a23c44ff0735d55c0c6b151a2f736835a39b2a40c9fd47650506790b0b5c88d2472d6032c4d01c8f2e21de94e080637299707885fba9b85c393226fa581b6');

INSERT OR IGNORE INTO courses (course_id, course_code, title, description, category, level, instructor_id) VALUES
  ('course-1', 'CSC 301', 'Data Structures', 'Study core data structures, algorithm design, searching, sorting, and analysis.', 'Data Structures', '300 Level', 'user-6'),
  ('course-2', 'CSC 307', 'Operating Systems', 'Explore processes, memory management, concurrency, and operating system design.', 'Operating Systems', '300 Level', 'user-6'),
  ('course-3', 'CSC 321', 'Computer Science Innovation and New Technologies', 'Investigate emerging technologies and innovation in contemporary computer science.', 'Innovation', '300 Level', 'user-6'),
  ('course-4', 'DTS 305', 'Data Management I', 'Manage data with relational concepts, SQL operations, data integrity, and database design.', 'Data Management', '300 Level', 'user-6'),
  ('course-5', 'ICT 305', 'Data Communication System and Network', 'Learn communication models, network protocols, addressing, and network security fundamentals.', 'Networking', '300 Level', 'user-6'),
  ('course-6', 'SEN 301', 'Object Oriented Analysis and Design', 'Model software systems with object-oriented analysis, design principles, and UML.', 'Software Engineering', '300 Level', 'user-6'),
  ('course-7', 'DTS 301', 'Big Data Computing', 'Explore distributed data processing, big-data platforms, and scalable computation.', 'Data Science', '300 Level', 'user-6'),
  ('course-8', 'GIT 313', 'Cisco Certified Network Associate', 'Practice networking concepts, routing, switching, and Cisco-style configuration exercises.', 'Networking', '300 Level', 'user-6'),
  ('course-9', 'FIC 303', 'Theology of Science and Innovation', 'Consider ethical, philosophical, and theological perspectives on science and innovation.', 'General Studies', '300 Level', 'user-6'),
  ('course-10', 'IFT 301', 'Web Application Development', 'Design and implement interactive, accessible, data-driven web applications.', 'Web Development', '300 Level', 'user-6'),
  ('course-11', 'IFT 355', 'Database Programming', 'Build database-backed applications using SQL, data modelling, and secure queries.', 'Database', '300 Level', 'user-6')
ON CONFLICT(course_id) DO UPDATE SET
  course_code = excluded.course_code,
  title = excluded.title,
  description = excluded.description,
  category = excluded.category,
  level = excluded.level,
  instructor_id = excluded.instructor_id;

WITH module_rows(sort_order, title) AS (
  VALUES (1, 'Foundations'), (2, 'Core Concepts'), (3, 'Practice and Review')
)
INSERT OR IGNORE INTO modules (module_id, course_id, title, sort_order)
SELECT courses.course_id || '-module-' || module_rows.sort_order, courses.course_id, module_rows.title, module_rows.sort_order
FROM courses CROSS JOIN module_rows;

INSERT OR IGNORE INTO lessons (lesson_id, module_id, title, content, content_type, duration_minutes, sort_order)
SELECT modules.module_id || '-lesson-1', modules.module_id, modules.title || ': guided study', 'Sample lesson content for this 300-level course. Replace with instructor-approved learning materials.', 'reading', 15, 1
FROM modules;
