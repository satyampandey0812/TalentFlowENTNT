import { createServer, Model, Factory, Response } from "miragejs";
import { faker } from "@faker-js/faker";

const paginate = (array, queryParams) => {
  const page = Number(queryParams.page) || 1;
  const pageSize = Number(queryParams.pageSize) || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return array.slice(start, end);
};

export function makeServer({ environment = "development" } = {}) {
  const server = createServer({
    environment,

    models: {
      job: Model,
      candidate: Model,
      assessment: Model,
    },

    factories: {
      job: Factory.extend({
        id() {
          return faker.string.uuid();
        },
        company() {
          return faker.company.name();
        },
        title() {
          const jobTitles = [
            'Senior Software Engineer', 'Frontend Developer', 'Backend Developer',
            'Full Stack Developer', 'DevOps Engineer', 'Data Scientist',
            'Machine Learning Engineer', 'Product Manager', 'UX Designer',
            'UI Developer', 'QA Engineer', 'Technical Lead',
            'Cloud Architect', 'Mobile Developer', 'Systems Administrator',
            'Database Administrator', 'Security Analyst', 'Network Engineer',
            'Scrum Master', 'Business Analyst', 'Project Manager',
            'Technical Writer', 'Support Engineer', 'Solution Architect'
          ];
          return faker.helpers.arrayElement(jobTitles);
        },
        slug() {
          return faker.helpers.slugify(this.title).toLowerCase();
        },
        status() {
          return faker.helpers.arrayElement(["active", "archived"]);
        },
        tags() {
          const allTags = [ "remote", "hybrid", "onsite", "engineering", "development", "full-time", "part-time", "contract", "design", "marketing", "sales", "support", "management", "entry-level", "senior", "javascript", "react", "python", "java", "nodejs", "aws", "azure", "docker", "kubernetes", "sql" ];
          return faker.helpers.arrayElements(allTags, { min: 2, max: 5 });
        },
        order(i) {
          return i + 1;
        },
        createdAt() {
          return faker.date.between({ from: '2023-01-01', to: '2024-01-31' });
        },
        department() {
          return faker.helpers.arrayElement([ 'Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Operations', 'Support', 'Finance', 'HR' ]);
        },
        location() {
          return faker.helpers.arrayElement([ 'Remote', 'New York, NY', 'San Francisco, CA', 'Austin, TX', 'Chicago, IL', 'Boston, MA', 'Seattle, WA', 'Los Angeles, CA', 'London, UK', 'Berlin, Germany', 'Toronto, Canada' ]);
        },
        salaryRange() {
          const ranges = [ '$80k - $120k', '$100k - $150k', '$120k - $180k', '$150k - $200k', '$60k - $90k', '$90k - $130k' ];
          return faker.helpers.arrayElement(ranges);
        },
        experience() {
          return faker.number.int({ min: 1, max: 10 });
        },
        description() {
          return faker.lorem.paragraphs(3);
        }
      }),
      candidate: Factory.extend({
        id() {
          return faker.string.uuid();
        },
        avatar() {
          return faker.image.avatar();
        },
        name() {
          return faker.person.fullName();
        },
        email() {
          return faker.internet.email();
        },
        stage() {
          return faker.helpers.arrayElement([ "applied", "screen", "tech", "offer", "hired", "rejected" ]);
        },
        appliedAt() {
          return faker.date.recent({ days: 60 });
        },
        phone() {
          return faker.phone.number();
        },
        currentCompany() {
          return faker.company.name();
        },
      }),
      assessment: Factory.extend({
        id() {
          return faker.string.uuid();
        },
        title() {
          return `Assessment for ${faker.person.jobTitle()}`;
        },
        description() {
          return faker.lorem.paragraph();
        },
      }),
    },

    seeds(server) {
      faker.seed(123);

      console.log("Seeding MirageJS database...");
      const jobs = server.createList("job", 120);
      const candidates = server.createList("candidate", 1000);

      candidates.forEach(candidate => {
        const randomJob = faker.helpers.arrayElement(jobs);
        candidate.update({ jobId: randomJob.id });
      });

      console.log(`Created ${jobs.length} jobs and ${candidates.length} candidates.`);
      
      // ✅ FIX: Create 3 complex, seeded assessments
      server.create('assessment', {
        jobId: jobs[0].id,
        title: 'Software Engineering Fundamentals',
        description: 'This assessment covers core concepts in software engineering and development.',
        sections: [
          {
            id: 'section-1',
            title: 'General Knowledge',
            description: 'A few general questions to test your basic understanding.',
            questions: [
              {
                id: 'q1', type: 'single-choice', text: 'What does "DRY" stand for?', required: true,
                options: ['Do not repeat yourself', 'Data redundancy yield', 'Distributed resource yield', 'Drive your code']
              },
              {
                id: 'q2', type: 'text-long', text: 'Explain the difference between a `for` loop and a `while` loop.', required: true,
                minLength: 50, maxLength: 500,
              },
            ],
          },
          {
            id: 'section-2',
            title: 'Technical Skills',
            description: 'Questions about your technical proficiency.',
            questions: [
              {
                id: 'q3', type: 'single-choice', text: 'Are you proficient in JavaScript?', required: true,
                options: ['Yes', 'No']
              },
              {
                id: 'q4', type: 'multiple-choice', text: 'Which of these are front-end frameworks?', required: true,
                options: ['React', 'Angular', 'Vue', 'Django', 'Flask']
              },
              {
                id: 'q5', type: 'numeric', text: 'On a scale of 1-10, how would you rate your problem-solving skills?', required: true,
                min: 1, max: 10
              },
              {
                id: 'q6', type: 'file', text: 'Please upload a link to your code repository.', required: false,
              },
            ],
          },
        ],
      });

      server.create('assessment', {
        jobId: jobs[1].id,
        title: 'Product Management Aptitude',
        description: 'This assessment evaluates your approach to product development and strategy.',
        sections: [
          {
            id: 'section-A',
            title: 'Product Strategy',
            description: 'Questions about how you approach product planning.',
            questions: [
              {
                id: 'qA1', type: 'text-short', text: 'Describe a feature you recently launched.', required: true,
                minLength: 20, maxLength: 100,
              },
              {
                id: 'qA2', type: 'single-choice', text: 'Have you used Agile methodologies?', required: true,
                options: ['Yes', 'No']
              },
            ],
          },
          {
            id: 'section-B',
            title: 'User Experience',
            description: 'Questions about your focus on the user.',
            questions: [
              {
                id: 'qB1', type: 'text-long', text: 'How would you gather user feedback for a new mobile app?', required: true,
                minLength: 50, maxLength: 500,
              },
              {
                id: 'qB2', type: 'single-choice', text: 'Do you work well with designers?', required: true,
                options: ['Yes', 'No'],
              },
            ],
          },
        ],
      });
      
      server.create('assessment', {
        jobId: jobs[2].id,
        title: 'General Technical Interview',
        description: 'A mixed bag of technical and behavioral questions.',
        sections: [
          {
            id: 'section-X',
            title: 'Initial Screening',
            description: 'Basic questions to get to know you.',
            questions: [
              {
                id: 'qX1', type: 'text-short', text: 'What is a closure in JavaScript?', required: true,
                minLength: 10, maxLength: 200,
              },
              {
                id: 'qX2', type: 'single-choice', text: 'What is a common use case for a closure?', required: true,
                options: ['Data privacy', 'Looping through arrays', 'Defining variables', 'Making API calls'],
                dependsOn: { questionId: 'qX1', value: 'Data privacy' },
              },
            ],
          },
        ],
      });
    },

    routes() {
      this.namespace = "api";
      this.timing = 750;
      this.passthrough();

      // ####################
      // ## Job Routes
      // ####################
      this.get("/jobs", (schema, request) => {
        let jobs = schema.jobs.all().models;
        const { search, status, tag } = request.queryParams;

        if (search) {
          const searchTerm = search.toLowerCase();
          jobs = jobs.filter(j =>
            j.title.toLowerCase().includes(searchTerm) ||
            j.company.toLowerCase().includes(searchTerm) ||
            j.location?.toLowerCase().includes(searchTerm)
          );
        }
        if (status && status !== "all") {
          jobs = jobs.filter(j => j.status === status);
        }
        if (tag) {
          jobs = jobs.filter(j => j.tags?.includes(tag));
        }

        jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const paginatedJobs = paginate(jobs, request.queryParams);
        const pageSize = Number(request.queryParams.pageSize) || 10;

        return {
          jobs: paginatedJobs.map(job => job.attrs),
          total: jobs.length,
          page: Number(request.queryParams.page) || 1,
          pageSize,
          totalPages: Math.ceil(jobs.length / pageSize)
        };
      });

      this.get("/jobs/:id", (schema, request) => {
        const job = schema.jobs.find(request.params.id);
        if (!job) {
          return new Response(404, {}, { error: "Job not found" });
        }
        return { job: job.attrs };
      });

      this.post("/jobs", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        if (!attrs.title) {
          return new Response(400, {}, { error: "Title is required" });
        }
        const newJobData = {
          ...attrs,
          status: "active",
          createdAt: new Date().toISOString()
        };
        const job = schema.jobs.create(newJobData);
        return { job: job.attrs };
      });

      this.patch("/jobs/:id", (schema, request) => {
        const job = schema.jobs.find(request.params.id);
        if (!job) {
          return new Response(404, {}, { error: "Job not found" });
        }
        const attrs = JSON.parse(request.requestBody);
        job.update(attrs);
        return { job: job.attrs };
      });

      // ####################
      // ## Candidate Routes
      // ####################
      this.get("/candidates", (schema, request) => {
        let candidates = schema.candidates.all().models;
        const { search, stage, jobId } = request.queryParams;

        if (search) {
          const searchTerm = search.toLowerCase();
          candidates = candidates.filter(c =>
            c.name.toLowerCase().includes(searchTerm) ||
            c.email.toLowerCase().includes(searchTerm)
          );
        }
        if (stage && stage !== "all") {
          candidates = candidates.filter(c => c.stage === stage);
        }
        if (jobId) {
          candidates = candidates.filter(c => c.jobId === jobId);
        }
        
        const paginatedCandidates = paginate(candidates, request.queryParams);
        const pageSize = Number(request.queryParams.pageSize) || 20;

        return {
          candidates: paginatedCandidates.map(c => c.attrs),
          total: candidates.length,
          page: Number(request.queryParams.page) || 1,
          pageSize,
          totalPages: Math.ceil(candidates.length / pageSize)
        };
      });

      this.get("/candidates/:id", (schema, request) => {
        const candidate = schema.candidates.find(request.params.id);
        if (!candidate) {
          return new Response(404, {}, { error: "Candidate not found" });
        }
        const job = candidate.jobId ? schema.jobs.find(candidate.jobId) : null;
        return { candidate: candidate.attrs, job: job?.attrs || null };
      });

      this.get("/candidates/:id/timeline", (schema, request) => {
        return { timeline: [] };
      });

      this.post("/candidates/:id/notes", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return { success: true, note: attrs };
      });

      this.patch("/candidates/:id", (schema, request) => {
        const candidate = schema.candidates.find(request.params.id);
        if (!candidate) {
          return new Response(404, {}, { error: "Candidate not found" });
        }
        const attrs = JSON.parse(request.requestBody);
        candidate.update(attrs);
        return { candidate: candidate.attrs };
      });

      // ####################
      // ## Assessment Routes
      // ####################
      this.get("/assessments/:jobId", (schema, request) => {
        const { jobId } = request.params;
        const assessment = schema.assessments.findBy({ jobId });
        if (assessment) {
          return { assessment: assessment.attrs };
        }
        return new Response(404, {}, { error: "Assessment not found" });
      });
      
      this.get("/assessments", (schema) => {
        const assessments = schema.assessments.all();
        return { assessments: assessments.models.map(a => a.attrs) };
      });
      this.post("/assessments/:assessmentId/submit", (schema, request) => {
  const { assessmentId } = request.params;
  const attrs = JSON.parse(request.requestBody);

  // You can log the data to the console to confirm it's being received
  console.log(`Received submission for assessment ${assessmentId}:`, attrs);
  
  // Return a success response
  return new Response(200, {}, { success: true });
});

      this.put("/assessments/:jobId", (schema, request) => {
        const { jobId } = request.params;
        const attrs = JSON.parse(request.requestBody);
        let assessment = schema.assessments.findBy({ jobId });

        if (assessment) {
          assessment.update(attrs);
        } else {
          assessment = schema.assessments.create({ ...attrs, jobId });
        }
        return { assessment: assessment.attrs };
      });
this.delete('/assessments/:id', (schema, request) => {
  let id = request.params.id;
  schema.assessments.find(id)?.destroy();
  return { success: true };
});
    },
  });
  
  console.log("MirageJS server initialized successfully");
  return server;
}