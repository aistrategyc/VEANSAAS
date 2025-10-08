import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle, AlertTriangle, X } from "lucide-react"

export function ImportModal({ isOpen, onClose, onImportComplete }) {
  const [step, setStep] = useState("upload")
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
    }
  }

  const parseCSV = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result
        const lines = text.split("\n").filter((line) => line.trim())
        const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
        const data = lines.slice(1).map((line, index) => {
          const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))
          const row = { _rowNumber: index + 2 }
          headers.forEach((header, i) => {
            row[header] = values[i] || ""
          })
          return row
        })
        resolve(data)
      }
      reader.readAsText(file)
    })
  }

  const validateAndPreview = async () => {
    if (!file) return

    setStep("processing")
    setProgress(25)

    const data = await parseCSV(file)
    setProgress(50)

    const valid = []
    const invalid = []
    const duplicates = []

    // Mock existing clients for duplicate detection
    const existingClients = [
      {
        id: "existing1",
        firstName: "Анна",
        lastName: "Петрова",
        email: "anna.petrova@email.com",
        phone: "+48 (916) 123-45-67",
        organizationId: "org1",
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ]

    data.forEach((row) => {
      const errors = []

      // Validate required fields
      if (!row["Имя"] || !row["Имя"].trim()) {
        errors.push("Имя обязательно")
      }
      if (!row["Фамилия"] || !row["Фамилия"].trim()) {
        errors.push("Фамилия обязательна")
      }

      // Validate email format
      if (row["Email"] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row["Email"])) {
        errors.push("Некорректный email")
      }

      // Check for duplicates
      const isDuplicate = existingClients.some(
        (existing) =>
          existing.firstName.toLowerCase() === row["Имя"]?.toLowerCase() &&
          existing.lastName.toLowerCase() === row["Фамилия"]?.toLowerCase() &&
          (existing.email === row["Email"] || existing.phone === row["Телефон"]),
      )

      if (isDuplicate) {
        const existing = existingClients.find(
          (c) =>
            c.firstName.toLowerCase() === row["Имя"]?.toLowerCase() &&
            c.lastName.toLowerCase() === row["Фамилия"]?.toLowerCase(),
        )
        duplicates.push({ row: row._rowNumber, data: row, existing })
      } else if (errors.length > 0) {
        invalid.push({ row: row._rowNumber, data: row, errors })
      } else {
        // Convert to Client format
        const client = {
          firstName: row["Имя"],
          lastName: row["Фамилия"],
          email: row["Email"] || undefined,
          phone: row["Телефон"] || undefined,
          dateOfBirth: row["Дата рождения"] || undefined,
          gender: row["Пол"] === "Ж" ? "FEMALE" : row["Пол"] === "М" ? "MALE" : undefined,
          notes: row["Заметки"] || undefined,
        }
        valid.push(client)
      }
    })

    setProgress(100)
    setPreview({ valid, invalid, duplicates })
    setStep("preview")
  }

  const handleImport = async () => {
    if (!preview) return

    setStep("processing")
    setProgress(0)

    // Simulate import process
    const clients= preview.valid.map((clientData, index) => ({
      id: `imported_${Date.now()}_${index}`,
      organizationId: "org1",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...clientData,
    }))

    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    const importResult= {
      total: preview.valid.length + preview.invalid.length + preview.duplicates.length,
      successful: preview.valid.length,
      failed: preview.invalid.length,
      duplicates: preview.duplicates.length,
      errors: preview.invalid.map((item) => ({
        row: item.row,
        field: "general",
        message: item.errors.join(", "),
      })),
    }

    setResult(importResult)
    setStep("complete")
    onImportComplete(clients)
  }

  const resetModal = () => {
    setStep("upload")
    setFile(null)
    setPreview(null)
    setProgress(0)
    setResult(null)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Импорт клиентов</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {step === "upload" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Загрузка файла</CardTitle>
                  <CardDescription>
                    Загрузите CSV файл с данными клиентов. Файл должен содержать колонки: Имя, Фамилия, Email, Телефон,
                    Дата рождения, Пол, Заметки.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium">Выберите CSV файл</p>
                      <p className="text-sm text-muted-foreground">Максимальный размер: 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="mt-4 block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                  </div>
                  {file && (
                    <div className="mt-4 flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{file.name}</span>
                      <Badge variant="outline">{(file.size / 1024).toFixed(1)} KB</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleClose}>
                  Отмена
                </Button>
                <Button onClick={validateAndPreview} disabled={!file}>
                  Предпросмотр
                </Button>
              </div>
            </div>
          )}

          {step === "preview" && preview && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Валидные записи</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-2xl font-bold">{preview.valid.length}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Ошибки</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="text-2xl font-bold">{preview.invalid.length}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Дубликаты</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <X className="h-4 w-4 text-orange-600" />
                      <span className="text-2xl font-bold">{preview.duplicates.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {preview.invalid.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Найдены ошибки в {preview.invalid.length} записях. Эти записи не будут импортированы.
                  </AlertDescription>
                </Alert>
              )}

              {preview.duplicates.length > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Найдены дубликаты в {preview.duplicates.length} записях. Эти записи не будут импортированы.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setStep("upload")}>
                  Назад
                </Button>
                <Button onClick={handleImport} disabled={preview.valid.length === 0}>
                  Импортировать ({preview.valid.length} записей)
                </Button>
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="space-y-4 text-center py-8">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Обработка данных...</h3>
                <Progress value={progress} className="w-full max-w-md mx-auto" />
                <p className="text-sm text-muted-foreground">{progress}% завершено</p>
              </div>
            </div>
          )}

          {step === "complete" && result && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold">Импорт завершен!</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold">{result.total}</div>
                    <div className="text-sm text-muted-foreground">Всего записей</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-green-600">{result.successful}</div>
                    <div className="text-sm text-muted-foreground">Успешно</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-destructive">{result.failed}</div>
                    <div className="text-sm text-muted-foreground">Ошибки</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-orange-600">{result.duplicates}</div>
                    <div className="text-sm text-muted-foreground">Дубликаты</div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleClose}>Закрыть</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
