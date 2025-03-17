import matplotlib.pyplot as plt

if __name__ == "__main__":
    time = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00']
    temperature = [39.5, 39.7, 40.0, 39.8, 39.6, 39.7, 40.1, 39.9, 39.8]  # ตัวอย่างอุณหภูมิ
    humidity = [80, 82, 81, 79, 80, 83, 81, 80, 79]  # ตัวอย่างความชื้น

    # กำหนดขนาดของกราฟ
    plt.figure(figsize=(12, 6))

    # การแสดงอุณหภูมิ
    plt.plot(time, temperature, color='red', marker='o', label='Temperature (°C)', linestyle='--')

    # การแสดงความชื้น
    plt.plot(time, humidity, color='blue', marker='x', label='Humidity (%)')

    # เพิ่ม label และ title
    plt.title('Temperature and Humidity Over Time', loc='center', fontsize=14)
    plt.xlabel('Time of Day', fontsize=12)
    plt.ylabel('Value', fontsize=12)

    # เพิ่ม legend
    plt.legend()

    # แสดงกริด
    plt.grid(True, which='both', axis='both', linestyle='--', color='gray')

    # แสดงกราฟ
    plt.show()
