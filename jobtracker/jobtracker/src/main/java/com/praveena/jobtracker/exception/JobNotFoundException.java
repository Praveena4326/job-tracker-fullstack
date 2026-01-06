package com.praveena.jobtracker.exception;

public class JobNotFoundException extends RuntimeException {
    public JobNotFoundException(Long id) {
        super("Job application not found with id: " + id);
    }
}