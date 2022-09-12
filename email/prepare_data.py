from cmath import isnan
import pandas as pd
import numpy as np
import json

df = pd.read_csv("../data/subscriptions_worcap2022.csv")

nlist = []

for i, row in df.iterrows():
    name = row['Nome completo:']
    email = row['E-mail:']
    education = '' if isinstance(row['Nível de Escolaridade:'], float) else row['Nível de Escolaridade:']
    institution = '' if isinstance(row['Instituição/Empresa:'], float) else row['Instituição/Empresa:']
    localization = '' if isinstance(row['Localidade atual:'], float) else row['Localidade atual:']
    mcs_ = row['Desejo me inscrever no(s) MINICURSO(S):']
    if isinstance(mcs_, float):
        mc1 = False
        mc2 = False
        mc3 = False
        mc4 = False
    else:
        mc1 = True if 'MC1' in mcs_ else False
        mc2 = True if 'MC2' in mcs_ else False
        mc3 = True if 'MC3' in mcs_ else False
        mc4 = True if 'MC4' in mcs_ else False
    nlist.append({
        'name': name,
        'email': email,
        'education': education,
        'institution': institution,
        'localization': localization,
        'mc1': mc1,
        'mc2': mc2,
        'mc3': mc3,
        'mc4': mc4
    })

with open("../data/subscriptions_worcap2022.json", "w", encoding="utf-8") as f:
    json.dump(nlist, f, ensure_ascii=False, indent=4)    