package com.praveena.jobtracker.service;

import com.praveena.jobtracker.model.JobApplication;
import com.praveena.jobtracker.model.JobStatus;
import com.praveena.jobtracker.repository.JobApplicationRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;
import com.praveena.jobtracker.exception.JobNotFoundException;
import java.util.List;


@Service
public class JobApplicationService {

    private final JobApplicationRepository repository;

    public JobApplicationService(JobApplicationRepository repository) {
        this.repository = repository;
    }

    public JobApplication create(JobApplication jobApplication) {
        //setting default status if null
        if (jobApplication.getStatus() == null) {
            jobApplication.setStatus(JobStatus.APPLIED);
        }
        return repository.save(jobApplication);
    }

    public List<JobApplication> getAll() {
        return repository.findAll();
    }

    public JobApplication updateStatus(Long id, JobStatus newStatus) {
        JobApplication job = repository.findById(id).orElseThrow(() -> new JobNotFoundException(id));

        job.setStatus(newStatus);
        return repository.save(job);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new JobNotFoundException(id);
        }
        repository.deleteById(id);
    }
}