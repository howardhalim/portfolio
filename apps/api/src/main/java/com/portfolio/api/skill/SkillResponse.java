package com.portfolio.api.skill;

public record SkillResponse(String name) {

    static SkillResponse from(Skill skill) {
        return new SkillResponse(skill.getName());
    }
}