import psycopg2
import requests
from bs4 import BeautifulSoup

page = requests.get('https://covid19asi.saglik.gov.tr/')

soup = BeautifulSoup(page.text, 'html.parser')

artist_name_list = soup.find(class_='svg-turkiye-haritasi')
artist_name_list_items = artist_name_list.find_all("text")
artist_list_items = artist_name_list.g("data-adi")



plaka_kodu =[]
for i in range(3, 164,2):
    plaka_kodu.append(i)   

kod =[]
for i in range(0, 80):
    kod.append(i)   

sehir_list = artist_name_list.g.contents
sehirlist = sehir_list[3]["data-adi"]

asi_sehir = []
asi_sayi = []

for sehirler in plaka_kodu:   
    detay= sehir_list[sehirler]["data-adi"]
    print(detay)
    detay_3= sehir_list[sehirler].find_all("text")[0].contents[0]
    detay_2= detay_3.replace('.','')
    print(detay_2)
    asi_sehir.append(detay)
    asi_sayi.append(detay_2)
    

print("INSERT INTO public.asi (" + str(asi_sehir[0]) , str(asi_sayi[0]) +" ) VALUES('test', 5);")



print(len(asi_sayi))


for asi_list in asi_sehir:
    sehir_listesi = asi_list
    print(sehir_listesi)




#Establishing the connection
conn = psycopg2.connect(
   database="dummy", user='postgres', password='recep61**', host='127.0.0.1', port= '5432'
)
#Setting auto commit false
conn.autocommit = True

#Creating a cursor object using the cursor() method
cursor = conn.cursor()




# Preparing SQL queries to INSERT a record into the database.
"""
cursor.execute('''INSERT INTO public.asi (il ,asi_sayisi)
    VALUES('''+str(asi_sehir[i]) +''', ''' +str(asi_sayi[i]) + ''');''')
"""
cursor.execute('''truncate table asi restart identity;;''')
kod =[]
for i in range(0, 81):
    kod.append(i)
    sehir= str(asi_sehir[i].encode('utf-8').strip())
    sayi= str(asi_sayi[i])
    print(sehir,sayi)
    cursor.execute('''INSERT INTO public.asi (il ,asi_sayisi) VALUES('''+''' ' ''' + sehir + '''' ''' +''', ''' + sayi + ''');''')


# Commit your changes in the database
conn.commit()
print("Records inserted........")

# Closing the connection
conn.close()




