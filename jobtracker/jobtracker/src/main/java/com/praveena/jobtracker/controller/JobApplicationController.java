package com.praveena.jobtracker.controller;

import com.praveena.jobtracker.model.JobApplication;
import com.praveena.jobtracker.service.JobApplicationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.praveena.jobtracker.model.JobStatus;

@RestController

@RequestMapping("/applications")
@CrossOrigin(origins = "http://localhost:3000")

public class JobApplicationController {

    private final JobApplicationService service;

    public JobApplicationController(JobApplicationService service) {
        this.service = service;
    }

    //CREATE: POST /applications
    @PostMapping
    public JobApplication create(@Valid @RequestBody JobApplication jobApplication)
    {
        return service.create(jobApplication);
    }

    //READ ALL: GET /applications
    @GetMapping
    public List<JobApplication> getAll()
    {
        return service.getAll();
    }

    @PutMapping("/{id}/status")
    public JobApplication updateStatus(@PathVariable Long id,
                                       @RequestParam JobStatus status) {
        return service.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}