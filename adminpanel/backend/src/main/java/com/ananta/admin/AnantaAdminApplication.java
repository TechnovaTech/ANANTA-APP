package com.ananta.admin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import jakarta.annotation.PostConstruct;
import java.util.TimeZone;

@SpringBootApplication
public class AnantaAdminApplication {

	@PostConstruct
	public void init() {
		// Force IST (Indian Standard Time) for entire application
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
		System.out.println("Application timezone set to: " + TimeZone.getDefault().getID());
	}

	public static void main(String[] args) {
		SpringApplication.run(AnantaAdminApplication.class, args);
	}

}
