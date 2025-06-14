README - Canal Moderno Dummy Dataset

Este archivo contiene datos ficticios (dummy) de puntos de venta y métricas asociadas usadas para simulaciones y pruebas.

A continuación se describen las variables (columnas) del conjunto de datos:


Unnamed 0: 
Índice de fila generado automáticamente al exportar el DataFrame (equivalente al índice del registro).

geometry: 
Ubicación geográfica en formato WKT (Well-Known Text), con coordenadas de tipo POINT (longitud latitud) que indican la posición del punto de venta.

nombre: 
Nombre del punto de venta o establecimiento (por ejemplo, sucursales de OXXO, plazas comerciales, etc.).

nps: 
Net Promoter Score. Índice que mide la satisfacción del cliente y la probabilidad de recomendación del establecimiento. Se mide de -100 a 100.

fillfoundrate: 
Indica el porcentaje de los productos solicitados durante la visita que realmente se encontraron en existencia y fueron provistos o registrados en el inventario para cumplir con la demanda.

damage_rate: 
Tasa de productos dañados. Porcentaje de los artículos en stock que presentaron algún daño o defecto.

out_of_stock: 
Porcentaje de los productos solicitados por clientes o analistas de campo que no se encontraban disponibles en el punto de venta al momento de la visita.