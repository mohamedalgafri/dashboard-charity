import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { CheckCircle2, Heart } from "lucide-react";
  

  export const SuccessModal = ({ isOpen, setIsOpen, donorName, amount }) => {
    const formattedAmount = typeof amount === 'number' ? amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) : '0.00';
  
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md text-center p-8">
          <DialogHeader className="space-y-6">
            <div className="relative mx-auto">
              <div className="animate-pulse absolute inset-0 rounded-full bg-green-100/50" />
              <div className="relative mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold">
              شكراً لتبرعك السخي!
              <Heart className="inline-block ml-2 w-6 h-6 text-red-500" />
            </DialogTitle>
            <DialogDescription className="text-lg space-y-4">
              <p className="font-medium text-gray-900">
                شكراً {donorName} على تبرعك بمبلغ ${formattedAmount}
              </p>
              <p className="text-muted-foreground">
                تبرعك سيساعد في دعم هذا المشروع وتحقيق أهدافه النبيلة
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button 
              className="w-full"
              onClick={() => setIsOpen(false)}
            >
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };