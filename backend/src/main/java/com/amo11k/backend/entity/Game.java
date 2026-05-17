package com.amo11k.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "games")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "external_id", unique = true)
    private String externalId;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "cover_url", length = 500)
    private String coverUrl;

    @Column(name = "release_date", length = 50)
    private String releaseDate;

    @Column(length = 500)
    private String genres;

    @Column(length = 500)
    private String platforms;
}
