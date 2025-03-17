import streamlit as st
import pandas as pd
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import matplotlib.pyplot as plt

# ฟังก์ชั่นเชื่อมต่อกับ Google Sheets API
def get_google_sheet_data():
    scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/spreadsheets.readonly", "https://www.googleapis.com/auth/drive.readonly"]
    creds = ServiceAccountCredentials.from_json_keyfile_name('credentials.json', scope)
    client = gspread.authorize(creds)
    sheet = client.open_by_url('https://docs.google.com/spreadsheets/d/1fRtTmVbGJq5vGYpl22oirTJwJ3bsdLj042UmaWXGVB8/edit?gid=391054233')
    worksheet = sheet.get_worksheet(0)
    data = worksheet.get_all_records()
    return pd.DataFrame(data)

# ดึงข้อมูลจาก Google Sheets
df = get_google_sheet_data()

# แปลงข้อมูลเพื่อให้เหมาะสม
df['DateTime'] = pd.to_datetime(df['Date'] + ' ' + df['Time'], format='%d/%m/%Y %H:%M')
temperature = df['Temperature']
humidity = df['Humidity']
time = df['DateTime']

# แสดงกราฟใน Streamlit
st.title('Temperature and Humidity Over Time')

# สร้างกราฟ
fig, ax = plt.subplots(figsize=(10, 6))
ax.plot(time, temperature, color='red', label='Temperature (°C)')
ax.plot(time, humidity, color='blue', label='Humidity (%)')

ax.set_xlabel('Time')
ax.set_ylabel('Value')
ax.legend()
st.pyplot(fig)
