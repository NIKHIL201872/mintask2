use candid::{CandidType, Deserialize};
use ic_cdk::update;
use std::collections::HashMap;
use std::cell::RefCell;

#[derive(Clone, CandidType, Deserialize)]
pub struct Student {
    pub name: String,
    pub total_marks: f32,
    pub num_subjects: u64,
    pub average: f32,
    pub grade: String,
}

// In-memory storage
thread_local! {
    static STUDENTS: RefCell<HashMap<String, Student>> = RefCell::new(HashMap::new());
}

// Average calculation
fn calculate_average(total_marks: f32, num_subjects: u64) -> f32 {
    if num_subjects == 0 {
        0.0
    } else {
        total_marks / num_subjects as f32
    }
}

// Grade assignment
fn assign_grade(avg: f32) -> String {
    if avg >= 90.0 {
        "A".to_string()
    } else if avg >= 75.0 {
        "B".to_string()
    } else if avg >= 60.0 {
        "C".to_string()
    } else {
        "D".to_string()
    }
}

#[update]
fn generate_report(name: String, total_marks: f32, num_subjects: u64) -> Student {
    let average = calculate_average(total_marks, num_subjects);
    let grade = assign_grade(average);

    let student = Student {
        name: name.clone(),
        total_marks,
        num_subjects,
        average,
        grade,
    };

    STUDENTS.with(|s| s.borrow_mut().insert(name.clone(), student.clone()));

    student
}
