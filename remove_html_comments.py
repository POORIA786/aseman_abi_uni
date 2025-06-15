import os
import re

# مسیر فایل‌ها
directory = r"C:\Users\POORIA\Desktop\aseman-abi\aseman_abi_uni"

# الگوی کامنت‌های HTML
comment_pattern = r"<!--.*?-->"

def remove_comments_from_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    # حذف کامنت‌ها
    clean_content = re.sub(comment_pattern, '', content, flags=re.DOTALL)
    # فایل اصلی را بازنویسی کنیم
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(clean_content)

def process_directory(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                remove_comments_from_file(file_path)
                print(f"کامنت‌ها از فایل {file} حذف شدند.")

process_directory(directory)
