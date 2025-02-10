document.getElementById("searchButton").addEventListener("click", function () {
    let query = document.getElementById("searchInput").value.trim();
    
    if (query === "") {
        alert("Please enter a registration number or student name!");
        return;
    }

    fetch(`/search?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            let resultDiv = document.getElementById("result");
            resultDiv.innerHTML = "";

            if (data.error) {
                resultDiv.innerHTML = `<p class="text-danger">${data.error}</p>`;
            } else {
                data.forEach(student => {
                    let studentHTML = `
                        <div class="student-info p-3 mb-3">
                            <h4>📌 Student Info</h4>
                            <p><strong>Name:</strong> ${student.name}</p>
                            <p><strong>Reg No:</strong> ${student.reg_no}</p>
                            <p><strong>Branch:</strong> ${student.branch}</p>
                            <p><strong>Exams:</strong> ${student.exams}</p>

                            <table class="table table-dark table-bordered mt-2">
                                <thead>
                                    <tr>
                                        <th>Subject Code</th>
                                        <th>Subject Name</th>
                                        <th>Exam</th>
                                        <th>Semester</th>
                                    </tr>
                                </thead>
                                <tbody>
                    `;

                    student.subjects.forEach(sub => {
                        studentHTML += `
                            <tr>
                                <td>${sub["Subject Code"]}</td>
                                <td>${sub["Subject Name"]}</td>
                                <td>${sub["Exam Name"]}</td>
                                <td>${sub["Semester"]}</td>
                            </tr>
                        `;
                    });

                    studentHTML += `
                                </tbody>
                            </table>
                        </div>
                    `;

                    resultDiv.innerHTML += studentHTML;
                });
            }
        })
        .catch(error => console.error("Error:", error));
});
