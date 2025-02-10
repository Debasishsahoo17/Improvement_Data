from flask import Flask, request, jsonify, render_template
import pandas as pd
import os

app = Flask(__name__, static_url_path='/static')

# Excel file ka proper path
FILE_PATH = os.path.join(os.getcwd(), "BTech 5th Semester Improvement list STD.xlsx")

try:
    df = pd.read_excel(FILE_PATH)
    df["Student Name"] = df["Student Name"].astype(str).str.strip().str.replace(r"\s+", " ", regex=True)
except Exception as e:
    print("Error loading Excel file:", e)
    df = pd.DataFrame()  # Empty DataFrame to avoid crashes

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/search', methods=['GET'])
def search_student():
    s = request.args.get('query', '').strip()

    if df.empty:
        return jsonify({"error": "Data not loaded. Check the Excel file!"}), 500

    if not s:
        return jsonify({"error": "Please enter a name or registration number"}), 400

    if s.isdigit():
        res = df[df["Registration No."].astype(str) == s]
    else:
        s = " ".join(s.split())
        res = df[df["Student Name"].str.contains(s, case=False, na=False, regex=True)]

    if res.empty:
        return jsonify({"error": "No student found!"}), 404

    students = []
    for r, g in res.groupby("Registration No."):
        stu = g.iloc[0]
        students.append({
            "name": stu["Student Name"],
            "reg_no": int(stu["Registration No."]),
            "branch": stu["Branch"],
            "exams": int(len(g)),
            "subjects": list(g[["Subject Code", "Subject Name", "Exam Name", "Semester"]]
                .astype(str)
                .to_dict(orient="records"))
        })

    return jsonify(students)

if __name__ == '__main__':
    app.run(debug=True)
