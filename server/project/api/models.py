from django.db import models

class Currency(models.Model):
    ammount = models.IntegerField()
    conver_from = models.CharField(max_length=50)
    conver_to = models.CharField(max_length=50)

    def __str__(self):
        return self.ammount
    
