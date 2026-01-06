package com.praveena.jobtracker.model;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name="job_applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    @NotBlank(message = "companyName is required")
    @Size(max = 255)
    private String companyName;

    @Column(nullable=false)
    @NotBlank(message = "roleTitle is required")
    @Size(max = 255)
    private String roleTitle;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    @NotNull(message = "status is required")
    private JobStatus status=JobStatus.APPLIED;

    private LocalDate dateApplied;

    @Column(length=2000)
    @Size(max = 2000, message = "notes must be <= 2000 characters")
    private String notes;

    public JobApplication() {}

    // Getters + Setters
    public Long getId() { return id; }

    public String getCompanyName() {
        return companyName;
    }
    public void setCompanyName(String companyName)
    {
        this.companyName = companyName;
    }

    public String getRoleTitle()
    {
        return roleTitle;
    }
    public void setRoleTitle(String roleTitle)
    {
        this.roleTitle = roleTitle;
    }

    public JobStatus getStatus() {
        return status;
    }
    public void setStatus(JobStatus status) {
        this.status = status;
    }

    public LocalDate getDateApplied()
    {
        return dateApplied;
    }
    public void setDateApplied(LocalDate dateApplied) {
        this.dateApplied = dateApplied;
    }

    public String getNotes() {
        return notes;
    }
    public void setNotes(String notes) {
        this.notes = notes;
    }
}
