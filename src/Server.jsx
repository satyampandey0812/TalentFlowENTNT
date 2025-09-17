import { createServer, Model, Factory, Response } from "miragejs";
import { faker } from "@faker-js/faker";

// Helper function for consistent pagination logic
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
      faker.seed(123); // For consistent data on every refresh

      console.log("Seeding MirageJS database...");
      const jobs = server.createList("job", 120);
      const candidates = server.createList("candidate", 1000);

      candidates.forEach(candidate => {
        const randomJob = faker.helpers.arrayElement(jobs);
        candidate.update({ jobId: randomJob.id });
      });

      console.log(`Created ${jobs.length} jobs and ${candidates.length} candidates.`);
    },

    routes() {
      this.namespace = "api";
      this.timing = 750; // Simulate network latency
      this.passthrough(); // Allow unhandled requests to pass through

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

      this.patch("/candidates/:id", (schema, request) => {
        const candidate = schema.candidates.find(request.params.id);
        if (!candidate) {
          return new Response(404, {}, { error: "Candidate not found" });
        }
        const attrs = JSON.parse(request.requestBody);
        candidate.update(attrs);
        return { candidate: candidate.attrs };
      });
    },
  });

  console.log("MirageJS server initialized successfully");
  return server;
}