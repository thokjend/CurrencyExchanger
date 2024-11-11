from django.db import models

class Currency(models.model):
    ammount = models.IntegerField()
    conver_from = models.models.CharField(max_length=50)
    conver_to = models.models.CharField(max_length=50)

    def __str__(self):
        return self.name
    
